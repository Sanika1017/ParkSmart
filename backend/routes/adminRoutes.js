const express = require("express");
const router = express.Router();
const { adminLogin } = require("../controllers/adminController");

// ONLY LOGIN
router.post("/login", adminLogin);

module.exports = router;
