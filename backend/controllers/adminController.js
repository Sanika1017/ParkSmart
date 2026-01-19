const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ---------------- ADMIN LOGIN ONLY ----------------
const adminLogin = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const query = "SELECT * FROM admin WHERE username = ?";
  db.query(query, [username], async (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const admin = results[0];

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

   const token = jwt.sign(
  { id: admin.id, username: admin.username },
  process.env.JWT_SECRET, // ✅ use env
  { expiresIn: "1d" }
);

    res.json({
      message: "Admin login successful",
      token,
      admin: { id: admin.id, username: admin.username }
    });
  });
};

module.exports = { adminLogin };
