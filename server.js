require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require("cookie-parser");


const app = express();

const formRoutes = require("./routes/formRoutes");
const userRoutes = require("./routes/userRoutes");
const stripeRoutes = require("./routes/stripeRoutes");
const webhook = require("./routes/webhook");
const uploadRoutes = require("./routes/uploadRoutes");
const letterRoutes = require("./routes/letterRoutes");
const profileRoutes = require("./routes/profileRoutes");
const subscribeRoutes = require("./routes/subscribeRoutes")
const planRoutes = require ("./routes/planRoutes");
const creditReports = require("./routes/CreditReport")
const disputeRoutes = require("./routes/disputeRoutes")

const port = process.env.PORT || 5000;



// ✅ Enable CORS first
 app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,               // ✅ allow cookies
  })
);


// ✅ Serve uploaded files statically (optional but helpful)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Mount routes that use Multer BEFORE body parsers
app.use("/api/profiles", profileRoutes);

// ✅ Now apply body parsers for JSON/URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ✅ Other API routes
app.use("/api/auth", userRoutes);
app.use("/api", formRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/stripe/webhook", webhook);
app.use("/api", uploadRoutes);
app.use("/api", letterRoutes);
app.use("/api",subscribeRoutes);
app.use("/api/plan",planRoutes);
app.use("/api",creditReports)
app.use("/api/dispute",disputeRoutes)




// ✅ Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
