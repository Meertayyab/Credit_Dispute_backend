// const generateLetter = require("../utils/gptMetro2Letter");
// const generatePDF = require("../utils/pdfGenerator");
// const sendEmail = require("../utils/sendEmail");
// exports.createDispute = async (req, res) => {
//   try {
//     const { name, email } = req.body;
//     const letter = await generateLetter(req.body);
//     const filePath = generatePDF(letter, `letter_${Date.now()}.pdf`);
//     const bureaus = [
//       "equifax@credit.com",
//       "experian@credit.com",
//       "transunion@credit.com",
//     ];
//     for (const bureau of bureaus) {
//       await sendEmail(bureau, filePath, name,email);
//     }
//     res.json({ message: "Letter sent successfully" });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };


const generateLetter = require("../utils/gptMetro2Letter"); // uses GPT
const generatePDF = require("../utils/pdfGenerator");      // returns file path
const DisputeLetter = require("../models/creditReports");

exports.createDisputeLetter = async (req, res) => {
  try {
    const {
      fullName,
      address,
      cityStateZip,
      phone,
      dob,
      ssn,
      letterType,
      creditBureau,
      creditors,
      notaryLanguage,
      saveToHistory
    } = req.body;

    // 1. Generate letter content
    const letterContent = await generateLetter({
      fullName,
      address,
      cityStateZip,
      phone,
      dob,
      ssn,
      selectedLetterType: letterType,
      creditBureau,
      creditors,
      notaryLanguage
    });

    // 2. Generate PDF
    const filename = `letter_${Date.now()}.pdf`;
    const filePath = generatePDF(letterContent, filename);

    // 3. Save to history if requested
    if (saveToHistory) {
      await DisputeLetter.create({
        userId: req.user.id,
        fullName,
        address,
        cityStateZip,
        phone,
        dob,
        ssn,
        letterType,
        creditBureau,
        creditors,
        notaryLanguage,
        pdfPath: filePath
      });
    }

    // 4. Return the file
    res.download(filePath);

  } catch (error) {
    console.error("❌ Letter generation failed:", error.message);
    res.status(500).json({ message: "Failed to generate letter" });
  }
};
