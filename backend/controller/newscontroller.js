import News from "../models/newsmodel.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import transporter from "../config/nodemailer.js";
import { getEmailTemplate, getNewsletterTemplate } from "../email.js";

const submitNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ 
        message: 'Email is required',
        success: false 
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Please provide a valid email address',
        success: false 
      });
    }

    // Check if email already exists
    const existingSubscription = await News.findOne({ email: email.toLowerCase().trim() });
    if (existingSubscription) {
      return res.status(400).json({ 
        message: 'Email already subscribed to newsletter',
        success: false 
      });
    }

    const newNewsletter = new News({
      email: email.toLowerCase().trim(),
    });

    const savedNewsletter = await newNewsletter.save();

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Welcome to Propertia Newsletter! 🏠",
      html: getNewsletterTemplate(email),
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      message: "Newsletter subscribed successfully",
      success: true 
    });
  } catch (error) {
    console.error("Error saving newsletter data:", error);
    res.status(500).json({ 
      message: "Server error",
      success: false 
    });
  }
};

export { submitNewsletter };
