const userModel = require('../model/authModel');  
const sendEmail = require("../utils/email");
const nodemailer = require("nodemailer");
const cors = require("cors");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "mySecretKey123";
const EMAIL_SECRET = process.env.EMAIL_SECRET || "myEmailSecretKey";
const otpStore = {};
//  REGISTER 
const registerController = async (req, res) => { 
 try {
    const { name, email, phone, password } = req.body;

    let user = await userModel.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new userModel({ name, email, phone, password: hashedPassword, isVerified: false });

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; 
    await user.save();

    // send OTP email
    await sendEmail(email, "Taste Haven - Verify Your Email", 
      `<h3>Welcome to Taste Haven!</h3>
       <p>Your OTP code is <b>${otp}</b></p>
       <p>This OTP will expire in 10 minutes.</p>`
    );

    res.json({ message: "OTP sent to email. Please verify." });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: err.message });
  }
};
//verifyOtp
const verifyOtp = async (req, res) => {
 try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (user.otpExpires < Date.now()) return res.status(400).json({ message: "OTP expired" });
    // mark verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// Login User  
const loginController = async (req, res) => { 
  try { const { email, password } = req.body;
   // must match frontend keys 
if (!email || !password) { 
  return res.status(400).json({ 
    success: false, 
    message: "Email and password required" }); 
  } const user = await userModel.findOne({ email });
   if (!user) return res.status(401).json({
     success: false, message: "User not found" }); 
     const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ 
        success: false, message: "Invalid password" });
         const token = jwt.sign({
           id:user._id,
            name: user.name,
            phone: user.phone,
             email: user.email , 
             role: user.role, 
          }, JWT_SECRET, { expiresIn: "1h" }); res.json({ 
            success: true, user: { 
              id: user._id, 
              name: user.name, 
               phone: user.phone,
              email: user.email,
               role: user.role
            }, token });
           } catch (err) {
             console.error("Login error:", err); 
             res.status(500).json({
               success: false, message: err.message });
               } };
//  Get Users (Admin) 
const getUsers = async (req, res) => {
     try { const users = await userModel.find({}, '-password');
      res.status(200).json(users);
     } catch (err) { 
        res.status(500).json({ message: err.message }); }
     };
//  Delete User
const deleteUser = async (req, res) => {
    try {
        const user = await userModel.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
//resetPassword
const resetPassword = async (req, res) => {
 try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;  
user.passwordChangedAt = Date.now();
    await user.save();
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
//auth
const auth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
//adminOnly
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};
//create admin
const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: "admin"
    });

    res.status(201).json({ message: "Admin added successfully", admin: adminUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//logout
const logout = async (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
};
const getMe= async(req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select("-password"); // use decoded.id
        res.json(user);
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};
module.exports = {
    registerController,
    loginController,
    getUsers,
    deleteUser,
    resetPassword,
    auth,
    adminOnly,verifyOtp ,
    createAdmin,
    logout,
    getMe
};
