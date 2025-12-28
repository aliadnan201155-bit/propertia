import express from "express";
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import validator from "validator";
import crypto from "crypto";
import userModel from "../models/Usermodel.js";
import transporter from "../config/nodemailer.js";
import { getWelcomeTemplate } from "../email.js";
import { getPasswordResetTemplate } from "../email.js";

const backendurl = process.env.BACKEND_URL;

// Token blacklist for cross-app logout synchronization
// In production, use Redis or database for persistent storage
const tokenBlacklist = new Set();

const createtoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

dotenv.config();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const Registeruser = await userModel.findOne({ email });
    if (!Registeruser) {
      return res.json({ message: "Email not found", success: false });
    }
    const isMatch = await bcrypt.compare(password, Registeruser.password);
    if (isMatch) {
      const token = createtoken(Registeruser._id);
      return res.json({ token, user: { name: Registeruser.name, email: Registeruser.email }, success: true });
    } else {
      return res.json({ message: "Invalid password", success: false });
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Server error", success: false });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!validator.isEmail(email)) {
      return res.json({ message: "Invalid email", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ name, email, password: hashedPassword });
    await newUser.save();
    const token = createtoken(newUser._id);

    // send email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Welcome to Propertia - Your Account Has Been Created",
      html: getWelcomeTemplate(name)
    };

    await transporter.sendMail(mailOptions);

    return res.json({ token, user: { name: newUser.name, email: newUser.email }, success: true });
  } catch (error) {
    console.error(error);
    return res.json({ message: "Server error", success: false });
  }
};

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found", success: false });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000; // 1 hour
    await user.save();
    const resetUrl = `${process.env.WEBSITE_URL}/reset/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset - Propertia Security",
      html: getPasswordResetTemplate(resetUrl)
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Email sent", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const resetpassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await userModel.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token", success: false });
    }
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();
    return res.status(200).json({ message: "Password reset successful", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const adminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists in database
    const user = await userModel.findOne({ email });

    if (user) {
      // Verify password for registered user
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // IMPORTANT: Include user ID in token, not just email
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '30d' });
        return res.json({ token, success: true, user: { name: user.name, email: user.email } });
      } else {
        return res.status(400).json({ message: "Invalid password", success: false });
      }
    }

    // Fallback to environment variables for super admin
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      // For env admin, we need to create or find a user record
      // This is not ideal - better to have all admins in database
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '30d' });
      return res.json({
        token,
        success: true,
        user: { name: 'Admin', email: email }
      });
    }

    return res.status(400).json({ message: "Invalid credentials", success: false });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const logout = async (req, res) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      // Add token to blacklist
      tokenBlacklist.add(token);
      console.log('[Auth] Token blacklisted:', token.substring(0, 20) + '...');
    }
    return res.json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.json({ message: "Server error", success: false });
  }
};

// Verify if token is still valid (not blacklisted)
const verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ valid: false, message: "No token provided" });
    }

    const token = authHeader.split(' ')[1];

    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
      console.log('[Auth] Blacklisted token attempted:', token.substring(0, 20) + '...');
      return res.status(401).json({ valid: false, message: "Token has been revoked" });
    }

    // Verify JWT signature and expiration
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return res.json({ valid: true });
    } catch (jwtError) {
      return res.status(401).json({ valid: false, message: "Invalid or expired token" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ valid: false, message: "Server error" });
  }
};

// get name and email

const getname = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    return res.json(user);
  }
  catch (error) {
    console.error(error);
    return res.json({ message: "Server error", success: false });
  }
}



export { login, register, forgotpassword, resetpassword, adminlogin, logout, getname, verifyToken };