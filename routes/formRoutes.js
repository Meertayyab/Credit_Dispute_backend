const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");

router.get("/protected", authMiddleware, (req, res) => {
    console.log("✅ Protected route accessed by", req.user);
  res.json({ message: "You are authenticated!", userId: req.user.userId });
});

module.exports = router;
