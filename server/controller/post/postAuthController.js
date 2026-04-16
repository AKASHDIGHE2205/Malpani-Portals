import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../../db.js";
import {SECRET_KEY} from "../../config/env.js"
const SALT_ROUNDS = 10;

// ✅ Generate JWT Token
function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
}

// ✅ User Login
export const loginUser = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email_id = ?", [email], async (err, rows) => {
    if (err) {
      console.error("Error checking email:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (rows.length === 0) {
      console.log("User not found", email);
      return res.status(404).json({ message: "User not found...!" });
    }

    const user = rows[0];

    try {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        console.log("Incorrect password");
        return res.status(401).json({ message: "Invalid username or password...!" });
      }

      const userData = {
        userId: user.user_id,
        email: user.email_id,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.user_role,
        loc_id: user.loc_id,
      };

      // Example: set admin role for specific emails
      const adminEmails = ["admin@gmail.com"];
      if (adminEmails.includes(email)) {
        userData.role = "admin";
      }

      const token = generateToken(userData);
      console.log(`Login successful by ${user.first_name} ${user.last_name} as ${user.role}`);

      return res.status(200).json({
        message: `Login successful! Welcome back, ${user.first_name.toUpperCase()}!`,
        token,
        ...userData,
      });
    } catch (error) {
      console.error("Error comparing passwords:", error);
      return res.status(500).json({ message: "Error comparing passwords" });
    }
  });
};

// ✅ User Registration
export const registerUser = async (req, res) => {
  const { username, password, status, role, first_name, middle_name, last_name, email_id, mobile } = req.body;

  if (!username || !password || !email_id || !mobile) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const sql = `INSERT INTO users 
      (username, password, status, role, first_name, middle_name, last_name, email_id, mobile) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
      sql,
      [username, hashedPassword, status, role, first_name, middle_name, last_name, email_id, mobile],
      (err, results) => {
        if (err) {
          console.error("Error registering user:", err);
          return res.status(500).json({ message: "Error registering user", details: err });
        }
        return res.status(200).json({ message: "User registered successfully", details: results });
      }
    );
  } catch (error) {
    console.error("Error hashing password:", error);
    return res.status(500).json({ message: "Error processing registration", details: error });
  }
};