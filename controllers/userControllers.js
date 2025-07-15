// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const sendEmail = require("../utils/sendEmail");

// // Register User
// exports.signupUser = async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const userExists = await User.findOne({ email });
//     if (userExists) return res.status(400).json({ message: "Email already in use" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     await User.create({ name, email, password: hashedPassword });

//     res.status(201).json({ message: "User registered successfully" });
//     console.log("✅ User registered successfully");
//   } catch (err) {
//     res.status(500).json({ message: "Registration failed", error: err.message });
//   }
// };

// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

//     // ✅ Console logs
//     console.log("🟢 Login successful:");
//     console.log("📧 Email:", user.email);
//     console.log("🔒 Hashed Password:", user.password);
//     console.log("👤 Name:", user.name);
//     console.log("🪪 JWT Token:", token);

//     res.json({
//       token,
//       user: {
//         name: user.name,
//         email: user.email
//       }
//     });

//   } catch (err) {
//     console.error("❌ Login error:", err.message);
//     res.status(500).json({ message: "Login failed", error: err.message });
//   }
// };

// // Delete User
// exports.deleteUser = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

//     await User.findByIdAndDelete(user._id);
//     console.log("🗑️ User deleted successfully");
//     res.json({ message: "User deleted successfully" });
//   } catch (error) {
//     console.error("❌ Delete error:", error);
//     res.status(500).json({ message: "User deletion failed", error: error.message });
//   }
// };


// exports.forgotPassword = async (req, res) => {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user)
//       return res
//         .status(200)
//         .json({ message: "If this email exists, reset link has been sent." }); // Avoid leaking user existence

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password/${token}`;

//     console.log(`📧 Password reset link: ${resetLink}`);
//     await sendEmail({
//       email:user.email,
//       subject:'Password Reset Request',
//       type:'verify',
//       name:user.name,
//       resetUrl:resetLink
//     })
//     // In production, send this link via email using Nodemailer or similar

//     res.json({ message: "Password reset link sent to your email." });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to send reset link", error: err.message });
//   }
// };

// /**
//  * Reset password using token
//  */
// exports.resetPassword = async (req, res) => {
//   const { token } = req.params;
//   const { newPassword } = req.body;

//   console.log('Token',token);

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('Decoded',decoded);
//     const user = await User.findById(decoded.id);
//     console.log('User',user);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     user.password = await bcrypt.hash(newPassword, 10);
//     await user.save();

//     console.log("🔁 Password reset successful");
//     await sendEmail({
//       email:user.email,
//       subject:'Password Reset Successful',
//       type:'reset',
//       name:user.name
//     })
//     res.json({ message: "Password reset successful" });
//   } catch (err) {
//     console.error("❌ Reset token error:", err.message);
//     res.status(400).json({ message: "Invalid or expired token", error: err.message });
//   }
// };



const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// Utility: Token Generators
const generateAccessToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

// ---------------------- REGISTER ------------------------
exports.signupUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });
    console.log("✅ User registered successfully");
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// ---------------------- LOGIN ------------------------
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, 
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log("🟢 Login successful");
    console.log("user token",accessToken)
    res.json({
      accessToken: accessToken,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// ---------------------- REFRESH TOKEN ------------------------
exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refresh_token;

  if (!refreshToken) {
    return res.status(400).json({ message: "Missing refresh token" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User no longer exists" });
    }

    const newAccessToken = generateAccessToken(user._id);

    return res.json({
      accessToken: newAccessToken,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

// ---------------------- LOGOUT (Optional) ------------------------
exports.logoutUser = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "Strict",
    secure: true,
  });
  return res.json({ message: "Logged out successfully" });
};

// ---------------------- DELETE USER ------------------------
exports.deleteUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    await User.findByIdAndDelete(user._id);
    console.log("🗑️ User deleted successfully");
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Delete error:", error);
    res.status(500).json({ message: "User deletion failed", error: error.message });
  }
};

// ---------------------- FORGOT PASSWORD ------------------------
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(200)
        .json({ message: "If this email exists, reset link has been sent." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password/${token}`;
    console.log(`📧 Password reset link: ${resetLink}`);

    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      type: "verify",
      name: user.name,
      resetUrl: resetLink,
    });

    res.json({ message: "Password reset link sent to your email." });
  } catch (err) {
    res.status(500).json({ message: "Failed to send reset link", error: err.message });
  }
};

// ---------------------- RESET PASSWORD ------------------------
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    console.log("🔁 Password reset successful");
    await sendEmail({
      email: user.email,
      subject: "Password Reset Successful",
      type: "reset",
      name: user.name,
    });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("❌ Reset token error:", err.message);
    res.status(400).json({ message: "Invalid or expired token", error: err.message });
  }
};
