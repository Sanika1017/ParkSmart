// controllers/staffController.js
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER STAFF (ADMIN ONLY) =================
const registerStaff = (req, res) => {
  const { name, username, password, phone } = req.body;

  if (!name || !username || !password || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existsQuery = "SELECT id FROM staff WHERE username = ?";
  db.query(existsQuery, [username], async (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO staff (name, username, password, phone, is_on_duty, access_requested)
      VALUES (?, ?, ?, ?, 0, 0)
    `;

    db.query(insertQuery, [name, username, hashedPassword, phone], (err) => {
      if (err) {
        console.error("Insert error:", err);
        return res.status(500).json({ message: "Failed to create staff" });
      }

      // Optional: Add SMS code here if Twilio is configured
      res.json({ message: "Staff created successfully" });
    });
  });
};

// ================= STAFF LOGIN =================
const loginStaff = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  db.query(
    "SELECT * FROM staff WHERE username = ?",
    [username],
    async (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      if (results.length === 0) {
        return res.status(401).json({ message: "Staff not found" });
      }

      const staff = results[0];
      const isMatch = await bcrypt.compare(password, staff.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (staff.is_on_duty === 0) {
        return res.status(403).json({
          accessDenied: true,
          staffId: staff.id,
          message: "Admin has not granted access yet. Please request access.",
        });
      }

      const token = jwt.sign(
        { id: staff.id, role: "staff" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        message: "Login successful",
        token,
        role: "staff",
        staff: { id: staff.id, name: staff.name, username: staff.username }
      });
    }
  );
};

// ================= REQUEST ACCESS =================
const requestAccess = (req, res) => {
  const { staffId } = req.body;

  if (!staffId) {
    return res.status(400).json({ message: "staffId is required" });
  }

  db.query(
    "UPDATE staff SET access_requested = 1 WHERE id = ?",
    [staffId],
    (err) => {
      if (err) {
        console.error("Update error:", err);
        return res.status(500).json({ message: "Failed to send request" });
      }
      res.json({ message: "Access request sent to admin" });
    }
  );
};

// ================= ADMIN: GET ALL STAFF =================
const getAllStaff = (req, res) => {
  db.query(
    "SELECT id, name, username, phone, is_on_duty, access_requested FROM staff",
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Server error" });
      }
      res.json(results);
    }
  );
};

// ================= ADMIN: TOGGLE DUTY / GRANT ACCESS =================
const toggleDuty = (req, res) => {
  const { id } = req.params;
  const { is_on_duty } = req.body;

  if (typeof is_on_duty !== "number" || (is_on_duty !== 0 && is_on_duty !== 1)) {
    return res.status(400).json({ message: "is_on_duty must be 0 or 1" });
  }

  db.query(
    "UPDATE staff SET is_on_duty = ?, access_requested = 0 WHERE id = ?",
    [is_on_duty, id],
    (err) => {
      if (err) {
        console.error("Update error:", err);
        return res.status(500).json({ message: "Failed to update" });
      }
      res.json({ message: "Staff status updated" });
    }
  );
};


// ================= VEHICLE ENTRY =================
const vehicleEntry = async (req, res) => {
  try {
    const { vehicleNumber } = req.body;

    // Validation
    if (!vehicleNumber) {
      return res.status(400).json({
        message: "Vehicle number is required",
      });
    }

    // Optional: prevent duplicate active entry
    const existing = await Vehicle.findOne({
      vehicleNumber,
      exitTime: null,
    });

    if (existing) {
      return res.status(400).json({
        message: "Vehicle already inside parking",
      });
    }

    const entry = new Vehicle({
      vehicleNumber,
      entryTime: new Date(),
      enteredBy: req.user.id, // from protect middleware
    });

    await entry.save();

    res.status(201).json({
      message: "Vehicle entry recorded",
      entry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


// ================= VEHICLE EXIT =================
const vehicleExit = (req, res) => {
  const { plateNumber } = req.body;
  const staffId = req.user.id; // from JWT

  if (!plateNumber) {
    return res.status(400).json({ message: "Vehicle number is required" });
  }

  // Find active entry (exit_time IS NULL)
  const findQuery = `
    SELECT id, entry_time 
    FROM vehicles 
    WHERE vehicle_number = ? AND exit_time IS NULL
    LIMIT 1
  `;
  db.query(findQuery, [plateNumber], (err, results) => {
    if (err) {
      console.error("Find error:", err);
      return res.status(500).json({ message: "Server error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "No active entry found for this vehicle" });
    }

    const { id: vehicleId, entry_time } = results[0];

    // Calculate fee
    const entryTime = new Date(entry_time);
    const exitTime = new Date();
    const durationMs = exitTime - entryTime;
    const hours = Math.ceil(durationMs / (1000 * 60 * 60)); // round up to next hour

    // You can make this configurable later (e.g. from a settings table)
    const ratePerHour = 50; // ₹50 per hour – change as needed
    const fee = hours * ratePerHour;

    // Update exit time and fee
    const updateQuery = `
      UPDATE vehicles 
      SET exit_time = NOW(), 
          fee = ?, 
          payment_status = 'UNPAID' 
      WHERE id = ?
    `;
    db.query(updateQuery, [fee, vehicleId], (err) => {
      if (err) {
        console.error("Exit update error:", err);
        return res.status(500).json({ message: "Failed to record exit" });
      }

      res.json({
        message: "Vehicle exit recorded successfully",
        vehicleNumber: plateNumber,
        entryTime: entryTime.toISOString(),
        exitTime: exitTime.toISOString(),
        durationHours: hours,
        fee: fee,
        paymentStatus: "UNPAID"
      });
    });
  });
};

module.exports = {
  registerStaff,
  loginStaff,
  requestAccess,
  getAllStaff,
  toggleDuty,
  vehicleEntry,    
  vehicleExit,
};