import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Email configuration with error handling
const createTransporter = () => {
  try {
    // Validate required environment variables
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('⚠️  Email configuration incomplete. Check SMTP_USER and SMTP_PASS environment variables.');
      return null;
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    });

    // Verify transporter configuration
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Email transporter verification failed:', error.message);
      } else {
        console.log('✅ Email server is ready to take our messages');
      }
    });

    return transporter;
  } catch (error) {
    console.error('❌ Failed to create email transporter:', error.message);
    return null;
  }
};

const transporter = createTransporter();

// Helper function to send emails with error handling
export const sendEmail = async (mailOptions) => {
  if (!transporter) {
    throw new Error('Email transporter not configured');
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    throw error;
  }
};

// Health check function
export const checkEmailHealth = async () => {
  if (!transporter) {
    return { status: 'error', message: 'Transporter not configured' };
  }

  try {
    await transporter.verify();
    return { status: 'healthy', message: 'Email service is operational' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
};

export default transporter;