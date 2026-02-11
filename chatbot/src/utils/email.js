import nodemailer from 'nodemailer';

const makeTransporter = async () => {
  // In development, if no SMTP configured, fallback to Ethereal for preview
  if ((process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) && !process.env.SMTP_HOST) {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass }
    });
  }

  if (!process.env.SMTP_HOST) {
    throw new Error('SMTP configuration missing (SMTP_HOST)');
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendEmail = async ({ to, subject, text, html, from }) => {
  if (!to) throw new Error('sendEmail: "to" is required');
  if (!subject) throw new Error('sendEmail: "subject" is required');

  const transporter = await makeTransporter();
  const mailOptions = {
    from: from || process.env.EMAIL_FROM || 'no-reply@yourdomain.com',
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);

  // Add preview URL when using Ethereal in dev
  try {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) info.previewUrl = previewUrl;
  } catch (err) {
    // ignore
  }

  return info;
};

export const templates = {
  welcome: ({ fullName }) => ({
    subject: `Welcome to Roofr${fullName ? `, ${fullName}` : ''}`,
    text: `Hi ${fullName || ''},\n\nWelcome to Roofr. Your account has been created successfully.\n\nRegards,\nRoofr Team`,
  }),
  reviewAck: ({ fullName }) => ({
    subject: `Thanks for your feedback${fullName ? `, ${fullName}` : ''}`,
    text: `Hi ${fullName || ''},\n\nYour feedback has been recorded. Thank you for helping us improve.\n\nRegards,\nRoofr Team`,
  }),
  inquiryAck: ({ name }) => ({
    subject: `Thanks for your inquiry${name ? `, ${name}` : ''}`,
    text: `Hi ${name || ''},\n\nThanks for contacting us. Your inquiry has been received and forwarded to our admin team. We will respond soon.\n\nRegards,\nRoofr Team`,
  }),
  inquiryNotificationToAdmin: ({ name, email, phone, message, property, inquiryId }) => ({
    subject: `New Inquiry from ${name || 'Unknown'}`,
    text: `New inquiry details:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nProperty: ${property || 'N/A'}\nMessage:\n${message}\n\nInquiry ID: ${inquiryId || 'N/A'}`,
  }),
};
