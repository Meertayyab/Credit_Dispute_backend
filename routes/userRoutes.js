const express = require("express");
const router = express.Router();
const {
  signupUser,
  loginUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  refreshToken
} = require("../controllers/userControllers");

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.delete("/delete", deleteUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/refresh-token",refreshToken)

module.exports = router;
