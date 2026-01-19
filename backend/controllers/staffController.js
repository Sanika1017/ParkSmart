const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");

// ✅ Create Twilio client ONCE
const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

// ✅ Register Staff (Admin only)
const registerStaff = (req, res) => {
  const { name, username, password, phone } = req.body;

  if (!name || !username || !password || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if username already exists
  const checkQuery = "SELECT id FROM staff WHERE username = ?";
  db.query(checkQuery, [username], async (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    if (results.length > 0) {
      return res.status(400).json({ message: "Staff username already exists" });
    }

    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert staff
      const insertQuery =
        "INSERT INTO staff (name, username, password, phone) VALUES (?, ?, ?, ?)";

      db.query(
        insertQuery,
        [name, username, hashedPassword, phone],
        async (err) => {
          if (err) return res.status(500).json({ message: err.message });

          // ✅ Send SMS after successful insert
          try {
            await client.messages.create({
              body: `Parking System Login Details:
Username: ${username}
Password: ${password}`,
              from: process.env.TWILIO_PHONE,
              to: phone,
            });
          } catch (smsErr) {
            console.error("SMS failed:", smsErr.message);
          }

          res.status(201).json({
            message: "Staff registered & SMS sent successfully",
          });
        }
      );
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// ✅ Staff Login
const loginStaff = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = "SELECT * FROM staff WHERE username = ?";
  db.query(query, [username], async (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    if (results.length === 0) {
      return res.status(400).json({ message: "Staff not found" });
    }

    const staff = results[0];
    const isMatch = await bcrypt.compare(password, staff.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: staff.id, username: staff.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      staff: {
        id: staff.id,
        name: staff.name,
        username: staff.username,
      },
    });
  });
};

module.exports = { registerStaff, loginStaff };
