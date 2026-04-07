import db from '../../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import axios from 'axios';

const SECRET_KEY = "your_secret_key";//Malpani@2025

// REGISTER USER  
export const registerUser = async (req, res) => {
  try {
    const { f_name, l_name, password, email, mobile } = req.body;
    // console.log(f_name, l_name, password, email, mobile);

    // Check required fields
    if (!f_name || !l_name || !password || !email || !mobile) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    // Check if user already exists
    const sql1 = `SELECT * FROM app_users WHERE (email = ? OR mobile = ?) AND status = 'A'`;
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

        const sql2 = `INSERT INTO app_users (password, first_name, last_name, email, mobile, role, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.query(sql2, [hashedPassword, f_name, l_name, email, mobile, 'User', 'A'], (err, results) => {
          if (err) {
            console.error("Error inserting user:", err);
            return res.status(500).json({ message: "Error while registering user", details: err });
          }

          return res.status(201).json({ message: "User registered successfully" });
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

    const sql = `SELECT * FROM app_users WHERE email = ?`;
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
        message: `Login successful! Welcome back, ${user.first_name.toUpperCase()}!`,
        token,
        user: {
          id: user.id,
          f_name: user.first_name,
          l_name: user.last_name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          loc_id: user.loc_id,
          user_type: user.user_type,
          status: user.status
        }
      });
    });
  } catch (error) {
    console.error("Unexpected server error:", error);
    return res.status(500).json({ message: "Unexpected server error", details: error });
  }
};


export const sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    const user_name = 't1malpani';
    const password = 'maplani'
    const sender = 'MALPNI';
    const entityID = '1201159436561584634';
    const TemplateID = '1707170609314821433';

    if (!mobile) {
      return res.status(400).json({ message: "mobile number is required" });
    }

    // ------------------------------------
    // 1️⃣ Check if user exists
    // ------------------------------------
    const checkUserSql = "SELECT id FROM app_users WHERE mobile = ?";
    db.query(checkUserSql, [mobile], async (err, results) => {
      if (err) {
        console.error("Error checking user:", err);
        return res.status(500).json({ message: "Internal server error", error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      // ------------------------------------
      // 2️⃣ Generate OTP
      // ------------------------------------
      const otp = Math.floor(100000 + Math.random() * 900000);

      const message = `Your OTP for Malpani Portal password reset is ${otp}. Valid for 10 minutes. Do not share this OTP. – MALPANI`;

      // URL encode message to avoid breaking the SMS API URL
      const encodedMessage = encodeURIComponent(message);

      // ------------------------------------
      // 3️⃣ SMS API URL
      // ------------------------------------
      const smsApiUrl = `https://nimbusit.co.in/api/swsend.asp?username=${user_name}&password=${password}&sender=${sender}&sendto=${mobile}&message=${encodedMessage}&entityID=${entityID}&TemplateID=${TemplateID}`;

      // ------------------------------------
      // 4️⃣ Send SMS
      // ------------------------------------
      try {
        await axios.get(smsApiUrl);
      } catch (smsError) {
        console.error("SMS Sending Error:", smsError);
        return res.status(500).json({ message: "Failed to send OTP", error: smsError });
      }

      // ------------------------------------
      // 5️⃣ Save OTP in DB
      // ------------------------------------
      const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // +10 minutes

      const updateSql = "UPDATE app_users SET otp_code = ?, otp_expiry = ? WHERE mobile = ?";

      db.query(updateSql, [otp, expiryTime, mobile], (err2) => {
        if (err2) {
          console.error("Error saving OTP:", err2);
          return res.status(500).json({
            message: "Internal server error while saving OTP",
            error: err2,
          });
        }

        return res.status(200).json({
          success: true,
          message: "OTP sent successfully",
        });
      });
    });

  } catch (error) {
    console.error("OTP sending error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending OTP",
    });
  }
};

export const validateOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: "mobile number is required" });
    }

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const sql = "SELECT otp_code, otp_expiry FROM app_users WHERE mobile = ?";

    db.query(sql, [mobile], (err, results) => {
      if (err) {
        console.error("Error fetching OTP:", err);
        return res.status(500).json({ message: "Internal server error.", error: err, });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const { otp_code, otp_expiry } = results[0];

      // Convert MySQL timestamp to JS timestamp
      const expiryTime = new Date(otp_expiry).getTime();
      const currentTime = Date.now();

      // Check OTP match
      if (otp != otp_code) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      // Check OTP expiration
      if (currentTime > expiryTime) {
        return res.status(400).json({ message: "OTP expired" });
      }

      // OTP is valid
      return res.status(200).json({ success: true, message: "OTP verified successfully", });
    });
  } catch (error) {
    console.error("OTP validation error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong while validating OTP", });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `UPDATE app_users SET password = ? WHERE mobile = ?`;

    db.query(sql, [hashedPassword, mobile], (err, results) => {
      if (err) {
        console.error("Error updating password:", err);
        return res.status(500).json({ message: "Internal server error.", error: err, });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "User not found", });
      }

      return res.status(200).json({ success: true, message: "Password reset successfully.", });
    });

  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong while resetting password", });
  }
};
