import db from '../../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const SECRET_KEY = "your_secret_key";

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { f_name, l_name, password, email, mobile } = req.body;

    if (!f_name || !l_name || !password || !email || !mobile) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    const sql1 = `SELECT * FROM st_user WHERE (email = ? OR mobile = ?) AND status = 'A'`;
    db.query(sql1, [email, mobile], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Internal server error", details: err });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: "User already exists." });
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql2 = `INSERT INTO st_user (f_name, l_name, password, email, mobile, role, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.query(sql2, [f_name, l_name, hashedPassword, email, mobile, 'User', 'A'], (err, results) => {
          if (err) {
            console.error("Error inserting user:", err);
            return res.status(500).json({ message: "Error while registering user", details: err });
          }

          return res.status(201).json({ message: "User registered successfully", userId: results.insertId });
        });
      } catch (hashError) {
        console.error("Error hashing password:", hashError);
        return res.status(500).json({ message: "Error processing registration", details: hashError });
      }
    });
  } catch (error) {
    console.error("Unexpected server error:", error);
    return res.status(500).json({ message: "Unexpected server error", details: error });
  }
};

// LOGIN USER
export const loginUser = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const sql = `SELECT * FROM st_user WHERE email = ?`;
    db.query(sql, [email], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Internal server error", details: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found." });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password." });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        message: `Login successful! Welcome back, ${user.f_name.toUpperCase()}!`,
        token,
        user: {
          id: user.id,
          f_name: user.f_name,
          l_name: user.l_name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
        }
      });
    });
  } catch (error) {
    console.error("Unexpected server error:", error);
    return res.status(500).json({ message: "Unexpected server error", details: error });
  }
};
