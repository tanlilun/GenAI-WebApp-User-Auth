import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a transporter using SMTP
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,      // e.g., "sandbox.smtp.mailtrap.io" or "smtp.gmail.com"
  port: process.env.SMTP_PORT,      // e.g., 2525 for Mailtrap, 465 for SSL
  auth: {
    user: process.env.SMTP_USER,    // SMTP username
    pass: process.env.SMTP_PASS,    // SMTP password
  },
});

// Define your sender info
export const sender = {
  email: "hello@genai.co",
  name: "GenAI Technologies",
};

// Example: function to send an email
export async function sendEmail({ to, subject, text, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to,            // can be a single email or array
      subject,
      text,
      html,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
