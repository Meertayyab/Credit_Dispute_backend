const express = require("express");
const multer = require("multer");
const path = require("path");
const Profile = require("../models/Profile");
const { createProfile } = require("../controllers/profileController");

const router = express.Router();

// Allowed MIME types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "image/jpg",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("❌ Unsupported file type: " + file.mimetype), false);
  }
};

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

// Setup upload handler
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max size per file
  },
});

// ✅ GET route to fetch all profiles
router.get("/getdata", async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ createdAt: -1 });
    res.status(200).json(profiles);
  } catch (err) {
    console.error("❌ Error fetching profiles:", err);
    res.status(500).json({ message: "Server error while fetching profiles." });
  }
});

// ✅ Profile creation route
router.post(
  "/add",
  upload.fields([
    { name: "photoId", maxCount: 1 },
    { name: "ssnProof", maxCount: 1 },
    { name: "addressProof", maxCount: 1 },
    { name: "otherDocs", maxCount: 5 },
  ]),
  (req, res, next) => {
    console.log("🧾 req.files:", req.files);
    console.log("📦 req.body:", req.body);
    next();
  },
  createProfile
);

module.exports = router;
