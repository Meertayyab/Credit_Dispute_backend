// routes/upload.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const User = require ("../models/User")
const CreditReport = require("../models/creditReports");
const authenticate = require("../middlewares/auth"); // your JWT auth middleware

const router = express.Router();
const upload = multer({ dest: "uploads/" });
router.post(
  "/upload-report",
  authenticate,
  upload.single("report"),
  async (req, res) => {
    try {
      console.log("🔎 req.file:", req.file);
      console.log("🔐 Authenticated user:", req.user);

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No file uploaded. Make sure you're using `report` as form field name and uploading a valid PDF.",
        });
      }

      const fileBuffer = fs.readFileSync(req.file.path);

      let parsed;
      try {
        parsed = await pdfParse(fileBuffer);
      } catch (parseErr) {
        return res.status(400).json({
          success: false,
          error: "PDF parsing failed: " + parseErr.message,
        });
      }

      console.log("📄 Raw PDF Text:\n", parsed.text);

      let accounts = extractCreditReportData(parsed.text);
      accounts = detectMetro2Violations(accounts);

      const user = await User.findById(req.user.id);
      const email = user?.email || "";

      const report = new CreditReport({
        userId: req.user.id,
        email,
        accounts,
      });

      await report.save();

      res.json({
        success: true,
        message: "Report uploaded and parsed",
        report,
      });
    } catch (err) {
      console.error("❌ Server error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);



// Simple line-by-line parser logic
function extractCreditReportData(text) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const accounts = [];
  let current = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Start of new account
    if (/^[A-Z0-9 .\-&]+[\d\*]{4,}/.test(line)) {
      if (Object.keys(current).length) accounts.push({ ...current });
      current = { name: line };
      continue;
    }

    if (/Opened:/i.test(line) && !current.date_opened) {
      const match = line.match(/Opened:\s*([\d\/\-]+)/i);
      if (match) current.date_opened = match[1];
    }

    if (/Balance:/i.test(line) && !current.balance) {
      const match = line.match(/Balance:\s*\$?([\d,]+)/i);
      if (match) current.balance = `$${match[1]}`;
    }

    if (/Status:/i.test(line) && !current.status) {
      const match = line.match(/Status:\s*(.+)/i);
      if (match) current.status = match[1].trim();
    }

    if (/Last (Payment|Activity):/i.test(line) && !current.last_activity) {
      const match = line.match(/Last (?:Payment|Activity):\s*([\d\/\-]+)/i);
      if (match) current.last_activity = match[1];
    }

    if (/Experian|Equifax|TransUnion/i.test(line) && !current.bureau) {
      current.bureau = line;
    }
  }

  if (Object.keys(current).length) accounts.push(current);

  return accounts;
}

function detectMetro2Violations(accounts) {
  return accounts.map((account) => {
    const violations = [];

    const balance = parseFloat(account.balance?.replace(/[^\d.]/g, "")) || 0;

    if (/charged off/i.test(account.status) && balance > 0) {
      violations.push("Charged off account has non-zero balance");
    }

    if (/closed/i.test(account.status) && balance > 0) {
      violations.push("Closed account should have zero balance");
    }

    if (!account.last_activity || account.last_activity === "N/A") {
      violations.push("Missing last activity date");
    }

    const openedDate = new Date(account.date_opened);
    if (openedDate.toString() !== "Invalid Date" && openedDate > new Date()) {
      violations.push("Date opened is in the future");
    }

    return {
      ...account,
      violations,
    };
  });
}

module.exports = router;
