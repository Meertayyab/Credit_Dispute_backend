const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  planType: {
    type: String,
    enum: ["Individual", "Business", "Enterprise"],
    required: true,
  },
  packageName: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  peopleLimit: {
    type: Number,
    required: true,
  },
  features: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Plan", planSchema);
