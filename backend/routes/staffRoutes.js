const express = require("express");
const router = express.Router();
const { registerStaff, loginStaff } = require("../controllers/staffController");
const protect = require("../middleware/authMiddleware");

// Admin → create staff
router.post("/register", protect, registerStaff);

// Staff → login
router.post("/login", loginStaff);

module.exports = router;
