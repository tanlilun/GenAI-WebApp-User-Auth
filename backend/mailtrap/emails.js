import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sender = {
  email: "palettembmr@gmail.com",
  name: "GenAI Technologies",
};

async function sendEmail({ to, subject, html, text }) {
  try {
    const info = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to,
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

// =====================================================
// Replace Mailtrap functions below with Nodemailer
// =====================================================

export const sendVerificationEmail = async (email, verificationToken) => {
  try {

	let html = VERIFICATION_EMAIL_TEMPLATE
		.replace("{company_product}", "GenAI Marketing")
		.replace("{verificationCode}", verificationToken);

    await sendEmail({
      to: email,
      subject: "Verify your email",
      html,
      text: `Your verification code is: ${verificationToken}`,
    });
  } catch (error) {
    throw new Error(`Error sending verification email: ${error.message}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {

    let html = WELCOME_EMAIL_TEMPLATE
		.replace("{company_product}", "GenAI Marketing")
		.replace("{company_info_name}", "Faculty Technologies Sdn. Bhd.")
		.replace("{company_info_address}", "22-01, Menara MBMR, 1, Jln Syed Putra")
		.replace("{company_info_city}", "Kuala Lumpur")
		.replace("{company_info_zip_code}", "58000")
		.replace("{company_info_country}", "Malaysia")
		.replace("{name}", name);

    await sendEmail({
      to: email,
      subject: "Welcome to Our Service!",
      html,
      text: `Welcome ${name}!`,
    });
  } catch (error) {
    throw new Error(`Error sending welcome email: ${error.message}`);
  }
};


export const sendPasswordResetEmail = async (email, resetURL) => {
	let html = PASSWORD_RESET_REQUEST_TEMPLATE
		.replace("{resetURL}", resetURL)
		.replace("{company_product}", "GenAI Marketing");

	try {
		await sendEmail({
		to: email,
		subject: "Reset your password",
		html,
		text: `Reset your password here: ${resetURL}`,
		});
	} catch (error) {
		throw new Error(`Error sending password reset email: ${error.message}`);
	}
};

export const sendResetSuccessEmail = async (email) => {
	let html = PASSWORD_RESET_SUCCESS_TEMPLATE
		.replace("{company_product}", "GenAI Marketing");

	try {
		await sendEmail({
		to: email,
		subject: "Password Reset Successful",
		html,
		text: "Your password has been reset successfully.",
		});
	} catch (error) {
		throw new Error(`Error sending password reset success email: ${error.message}`);
	}
};
