// seed/planSeeder.js
require('dotenv').config();
const mongoose = require("mongoose");
const Plan = require("../models/Plan");


const MONGO_URI = process.env.MONGO_URI;

const plans = [
  // Individual Plans
  {
    packageName: "IRON PACKAGE",
    price: 97,
    peopleLimit: 1,
    planType: "Individual",
    features: [
      "Generate Unlimited Metro2 Letters Per Attack",
      "Artificial Intelligence Generated Letters",
      "Free Live Weekly Software Training",
      "Free Support Community Access",
      "Printing & Mailing Services Available",
      "1:1 Training Support Available",
      "Add Unlimited Clients",
      "Client Portal Available",
    ],
  },
  {
    packageName: "BRONZE PACKAGE",
    price: 147,
    peopleLimit: 4,
    planType: "Individual",
    features: [
      "Generate Unlimited Metro2 Letters Per Attack",
      "Artificial Intelligence Generated Letters",
      "Free Live Weekly Software Training",
      "Free Support Community Access",
      "Printing & Mailing Services Available",
      "1:1 Training Support Available",
      "Add Unlimited Clients",
      "Client Portal Available",
    ],
  },

  // Business Plans
  {
    packageName: "SILVER PACKAGE",
    price: 197,
    peopleLimit: 8,
    planType: "Business",
    features: [
      "Generate Unlimited Metro2 Letters Per Attack",
      "Artificial Intelligence Generated Letters",
      "Free Live Weekly Software Training",
      "Free Support Community Access",
      "Printing & Mailing Services Available",
      "1:1 Training Support Available",
      "Add Unlimited Clients",
      "Client Portal Available",
    ],
  },
  {
    packageName: "GOLD PACKAGE",
    price: 297,
    peopleLimit: 17,
    planType: "Business",
    features: [
      "Generate Unlimited Metro2 Letters Per Attack",
      "Artificial Intelligence Generated Letters",
      "Free Live Weekly Software Training",
      "Free Support Community Access",
      "Printing & Mailing Services Available",
      "1:1 Training Support Available",
      "Add Unlimited Clients",
      "Client Portal Available",
    ],
  },

  // Enterprise Plans
  {
    packageName: "PLATINUM PACKAGE",
    price: 397,
    peopleLimit: 30,
    planType: "Enterprise",
    features: [
      "Generate Unlimited Metro2 Letters Per Attack",
      "Artificial Intelligence Generated Letters",
      "Free Live Weekly Software Training",
      "Free Support Community Access",
      "Printing & Mailing Services Available",
      "1:1 Training Support Available",
      "Add Unlimited Clients",
      "Client Portal Available",
    ],
  },
  {
    packageName: "DIAMOND PACKAGE",
    price: 997,
    peopleLimit: 100,
    planType: "Enterprise",
    features: [
      "Generate Unlimited Metro2 Letters Per Attack",
      "Artificial Intelligence Generated Letters",
      "Free Live Weekly Software Training",
      "Free Support Community Access",
      "Printing & Mailing Services Available",
      "1:1 Training Support Available",
      "Add Unlimited Clients",
      "Client Portal Available",
    ],
  },
];

const seedPlans = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    await Plan.deleteMany();
    await Plan.insertMany(plans);
    console.log("✅ Plans seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedPlans();
