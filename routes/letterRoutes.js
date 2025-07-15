// const express = require("express");
// const fs = require("fs");
// const path = require("path");
// const PDFDocument = require("pdfkit");
// const CreditReport = require("../models/creditReports");
// const authenticate = require("../middlewares/auth");
// const router = express.Router();

// router.get("/generate-letter/:reportId", authenticate, async (req, res) => {
//   try {
//     const report = await CreditReport.findOne({
//       _id: req.params.reportId,
//       userId: req.user.id,
//     });

//     if (!report) return res.status(404).json({ message: "Report not found" });

//     const doc = new PDFDocument();
//     const outputDir = path.join(__dirname, "../output");
//     if (!fs.existsSync(outputDir)) {
//       fs.mkdirSync(outputDir);
//     }
//     const filePath = path.join(
//       __dirname,
//       `../output/dispute-letter-${report._id}.pdf`
//     );
//     const writeStream = fs.createWriteStream(filePath);
//     doc.pipe(writeStream);

//     // OPTIONAL: Add user info if you have it
//     doc.fontSize(14).text(`Metro-2 Dispute Letter`, { align: "center" });
//     doc.moveDown();

//     doc.fontSize(12).text(`To Whom It May Concern,`);
//     doc.moveDown();

//     doc.text(
//       `I am writing to formally dispute the accuracy of the following accounts on my credit report.`
//     );

//     report.accounts.forEach((account, i) => {
//       if (!account.violations || account.violations.length === 0) return;

//       doc.moveDown().text(`Account ${i + 1}: ${account.name}`);
//       doc.text(`Status: ${account.status}`);
//       doc.text(`Balance: ${account.balance}`);
//       doc.text(`Opened On: ${account.date_opened}`);
//       doc.text(`Last Activity: ${account.last_activity}`);
//       doc.text(`Credit Bureau: ${account.bureau}`);
//       doc.moveDown().text(`⚠️ Metro-2 Violations:`);

//       account.violations.forEach((v, index) => {
//         doc.text(`  ${index + 1}. ${v}`);
//       });
//     });

//     doc.moveDown();
//     doc.text(
//       "Please investigate these accounts and correct or remove any inaccurate data according to the FCRA."
//     );
//     doc.text("Thank you for your attention.");
//     doc.moveDown().text("Sincerely,");
//     doc.text("Meer Tayyab");

//     doc.end();

//     writeStream.on("finish", () => {
//       res.download(filePath, `Metro2-Letter-${report._id}.pdf`);
//     });
//   } catch (err) {
//     console.error("❌ Letter generation error:", err.message);
//     res
//       .status(500)
//       .json({ message: "Failed to generate letter", error: err.message });
//   }
// });

// module.exports = router;


// routes/generateLetter.js or wherever your route is defined


const express = require("express");
const PDFDocument = require("pdfkit");
const CreditReport = require("../models/creditReports");
const authenticate = require("../middlewares/auth");

const router = express.Router();

router.get("/generate-letter/:reportId", authenticate, async (req, res) => {
  try {
    const report = await CreditReport.findOne({
      _id: req.params.reportId,
      userId: req.user.id,
    });

    if (!report) return res.status(404).json({ message: "Report not found" });

    const fileName = `dispute-letter-${report._id}.pdf`;

    // ✅ Set headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    // Create the PDF document and pipe to response
    const doc = new PDFDocument();
    doc.pipe(res);

    doc.fontSize(14).text(`Metro-2 Dispute Letter`, { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`To Whom It May Concern,`);
    doc.moveDown();
    doc.text(`I am writing to dispute the accuracy of the following accounts on my credit report.`);

    // ✅ Safe check for accounts array
    if (Array.isArray(report.accounts)) {
      report.accounts.forEach((account, i) => {
        if (!account.violations || account.violations.length === 0) return;

        doc.moveDown().text(`Account ${i + 1}: ${account.name}`);
        doc.text(`Status: ${account.status}`);
        doc.text(`Balance: ${account.balance}`);
        doc.text(`Opened On: ${account.date_opened}`);
        doc.text(`Last Activity: ${account.last_activity}`);
        doc.text(`Credit Bureau: ${account.bureau}`);
        doc.moveDown().text(`⚠️ Metro-2 Violations:`);

        account.violations.forEach((v, index) => {
          doc.text(`  ${index + 1}. ${v}`);
        });
      });
    } else {
      doc.moveDown().text("⚠️ No accounts were found in the credit report.");
    }

    doc.moveDown();
    doc.text("Please investigate these accounts and correct/remove inaccurate data under the FCRA.");
    doc.moveDown().text("Sincerely,");
    doc.text("Meer Tayyab");

    doc.end(); // ✅ Finalize the stream only once

  } catch (err) {
    console.error("❌ Letter generation error:", err.message);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to generate letter", error: err.message });
    }
  }
});


module.exports = router;
