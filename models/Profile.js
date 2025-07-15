const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  dob: Date,
  ssn: String,
  phone: String,
  streetAddress: String,
  city: String,
  state: String,
  zip: String,
  country: String,
  email: String,
  portalUsername: String,
  portalPassword: String,
  notes: String,
  creditReportMonitoringSite: String,
  creditReportHtml: String,
  mfsnUsername: String,
  mfsnPassword: String,
  mfsnDetails: String,
  reportTypes: [String],
  photoId: String,
  ssnProof: String,
  addressProof: String,
  otherDocs: [String],
}, { timestamps: true });

module.exports = mongoose.model("Profile", ProfileSchema);
