import Form from '../models/formmodel.js';
import transporter from '../config/nodemailer.js';
import { getFeedbackEmailTemplate } from '../email.js';

export const submitForm = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const newForm = new Form({
      name,
      email,
      phone,
      message,
    });

    const savedForm = await newForm.save();

    // Send feedback email notification to admin
    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL, // Send to admin email
      subject: 'New Contact Form Submission - Propertia',
      html: getFeedbackEmailTemplate({ name, email, phone, message })
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('✅ Feedback email sent successfully');
    } catch (emailError) {
      console.error('❌ Failed to send feedback email:', emailError);
      // Don't fail the request if email fails, just log it
    }

    res.json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};