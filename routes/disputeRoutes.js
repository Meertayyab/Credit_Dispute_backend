const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth");
const { createDisputeLetter } = require("../controllers/disputeController");

// POST /dispute/create
router.post("/create", authenticate, createDisputeLetter);

module.exports = router;
