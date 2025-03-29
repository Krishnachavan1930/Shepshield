import nodemailer from "nodemailer";
import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientName, patientId, sepsisRisk, doctorEmail } = req.body;

    if (!patientName || !patientId || !sepsisRisk || !doctorEmail) {
      res.status(400).json({ message: "Missing required fields." });
      return;
    }

    const message = `
    🚨 *Sepsis Alert* 🚨
    Patient: *${patientName}* (ID: *${patientId}*)
    Sepsis Risk: *${sepsisRisk}%*
    Immediate medical attention is required.
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: doctorEmail,
      subject: "Sepsis Alert - Immediate Attention Required",
      text: message,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Sepsis alert email sent successfully!" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
};
