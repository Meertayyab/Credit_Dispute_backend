// // models/CreditReport.js
// const mongoose = require("mongoose");

// const CreditAccountSchema = new mongoose.Schema({
//   name: String,
//   status: String,
//   balance: String,
//   date_opened: String,
//   last_activity: String,
//   bureau: String,
//   violations: [String],
// });

// const CreditReportSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   uploadedAt: {
//     type: Date,
//     default: Date.now,
//   },
//   accounts: [CreditAccountSchema],
// });

// module.exports = mongoose.model("CreditReport", CreditReportSchema);
const mongoose = require("mongoose");

const CreditorSchema = new mongoose.Schema({
  name: String,
  accountNumber: String,
});

const DisputeLetterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fullName: String,
  address: String,
  cityStateZip: String,
  phone: String,
  dob: String,
  ssn: String,
  letterType: String,
  creditBureau: String,
  creditors: [CreditorSchema],
  notaryLanguage: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  pdfPath: String,
});

module.exports = mongoose.model("DisputeLetter", DisputeLetterSchema);
