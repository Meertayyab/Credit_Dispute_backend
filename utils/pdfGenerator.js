const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

module.exports = function generateLetterPDF(content, filename) {
  const lettersDir = path.join(__dirname, "..", "letters");

  // ✅ Make sure directory exists
  if (!fs.existsSync(lettersDir)) {
    fs.mkdirSync(lettersDir, { recursive: true });
  }

  const filePath = path.join(lettersDir, filename);
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 50, bottom: 50, left: 50, right: 50 }
  });

  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // ✅ Set professional font and spacing
  doc
    .font("Times-Roman")
    .fontSize(12)
    .text(content, {
      align: "left",
      lineGap: 6,
      paragraphGap: 10
    });

  doc.end();
  return filePath;
};
