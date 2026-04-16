import jwt from 'jsonwebtoken';
import { SECRET_KEY } from "../config/env.js";

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    // Check header exists
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing"
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Check token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not provided"
      });
    }

    // Verify token
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Invalid or expired token"
        });
      }

      req.user = decoded;
      next();
    });

  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};