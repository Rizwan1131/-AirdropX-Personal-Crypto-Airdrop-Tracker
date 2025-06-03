import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  try {
    let token;

    // 1. Try to get token from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    

    // 2. Or from cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // contains { id: user._id }
    

    next(); // continue to route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default authMiddleware;
