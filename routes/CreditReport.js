const express = require("express");
const router = express.Router();
const CreditReport = require("../models/creditReports");
const authenticate = require("../middlewares/auth");

// GET /api/reports
router.get("/reports", authenticate, async (req, res) => {
  try {
    const reports = await CreditReport.find({ userId: req.user.id }).sort({ uploadedAt: -1 });
    res.json({ reports });
  } catch (err) {
    console.error("❌ Failed to fetch reports:", err);
    res.status(500).json({ message: "Server error fetching reports" });
  }
});

module.exports = router;
