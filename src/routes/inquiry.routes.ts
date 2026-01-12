// src/routes/inquiry.routes.ts
import { Router } from 'express';
import nodemailer from 'nodemailer';

const router = Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@yourdomain.com';
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

router.post('/', async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    // Send email to admin
    await transporter.sendMail({
      from: SMTP_USER,
      to: ADMIN_EMAIL,
      subject: `New Inquiry from ${name}`,
      html: `
        <h2>New Customer Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile:</strong> ${mobile || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Send auto-reply to user
    await transporter.sendMail({
      from: SMTP_USER,
      to: email,
      subject: 'We Received Your Inquiry',
      html: `
        <h2>Hello ${name},</h2>
        <p>Thank you for contacting us!</p>
        <p>We've received your inquiry and our team is reviewing it. We'll get back to you shortly.</p>
        <p><strong>Your message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <br>
        <p>Best regards,<br>Your Support Team</p>
      `,
    });

    res.status(200).json({ message: 'Inquiry sent successfully' });
  } catch (error: any) {
    console.error('Inquiry email error:', error);
    res.status(500).json({ message: 'Failed to send inquiry' });
  }
});

export default router;