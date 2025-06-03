


// Signup
import crypto from 'crypto';
import User from '../models/user.model.js';
import sendEmail from '../utils/sendEmail.js'; // You’ll build this
import bcrypt from 'bcrypt';
import {config} from 'dotenv'
import jwt from 'jsonwebtoken'
config()
const JWT_SECRET = process.env.JWT_SECRET;

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  
  if(!username || !email || !password){
    return res.status(400).json({
      message:"All feilds are required",
      seccess:false
    })
  }
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already exists', seccess:false });

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(20).toString('hex');

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    verificationToken,
  });

  await newUser.save();
  
  const link = `${process.env.BASE_URL}/api/v1/auth/verify/${verificationToken}`;
  await sendEmail(email, 'Verify Your Email', `Click here to verify: ${link}`);

  res.status(201).json({ message: 'Signup successful. Please verify your email.' });
};

// Email Verification
export const verifyEmail = async (req, res) => {
  try {
    const token = req.params.token
    const user = await User.findOne({ verificationToken:token });
    if (!user) return res.status(400).send("Invalid token");

    user.isVerified = true;
    user.verificationToken = undefined; // clear token
    await user.save();
    res.send("Email verified successfully! You can now log in.");
  } catch (err) {
    res.status(500).send("Server error");
  }
};


// Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isVerified) {
      return res.status(401).json({ message: "Email not verified" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
   res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};


