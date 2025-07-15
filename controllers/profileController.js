// const Profile = require("../models/Profile");

// exports.createProfile = async (req, res) => {
//   try {
//     const data = req.body;
//     console.log("📦 req.body:", req.body);

//     const files = req.files || {};
//     console.log("🔍 req.files:", req.files);

//     const profile = await Profile.create({
//       ...data,
//       photoId: files.photoId?.[0]?.filename || null,
//       ssnProof: files.ssnProof?.[0]?.filename || null,
//       addressProof: files.addressProof?.[0]?.filename || null,
//       otherDocs: Array.isArray(files.otherDocs)
//         ? files.otherDocs.map((file) => file.filename)
//         : [],
//     });

//     console.log("✅ Profile created successfully");
//     res.status(201).json({
//       message: "Profile created successfully",
//       profile,
//     });
//   } catch (error) {
//     console.error("❌ Error creating profile:", error.message);
//     res.status(500).json({
//       message: "Failed to create profile",
//       error: error.message,
//     });
//   }
// };

const Profile = require("../models/Profile");

exports.createProfile = async (req, res) => {
  try {
    console.log("🔁 Incoming request...");
    console.log("🧾 Headers:", req.headers['content-type']);
    console.log("🔍 Content-Type:", req.headers['content-type']); // Specific check

    console.log("📤 Content Length:", req.headers['content-length']);

    // Check raw request
    console.log("📦 Raw req.body:", req.body);
    console.log("🔍 Raw req.files:", req.files);

    const data = req.body || {};
    const files = req.files || {};

    if (!Object.keys(data).length) {
      console.warn("⚠️ req.body is EMPTY or not parsed.");
    }

    if (!Object.keys(files).length) {
      console.warn("⚠️ req.files is EMPTY or not parsed.");
    }

    const profile = await Profile.create({
      ...data,
      photoId: files.photoId?.[0]?.filename || null,
      ssnProof: files.ssnProof?.[0]?.filename || null,
      addressProof: files.addressProof?.[0]?.filename || null,
      otherDocs: Array.isArray(files.otherDocs)
        ? files.otherDocs.map((file) => file.filename)
        : [],
    });

    console.log("✅ Profile created successfully");
    res.status(201).json({
      message: "Profile created successfully",
      profile,
    });
  } catch (error) {
    console.error("❌ Error creating profile:", error.message);
    res.status(500).json({
      message: "Failed to create profile",
      error: error.message,
    });
  }
};
