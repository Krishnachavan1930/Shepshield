import axios from "axios";
import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

export const sendWhatsAppAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientName, patientId, sepsisRisk, whatsappNumber } = req.body;

    if (!patientName || !patientId || !sepsisRisk || !whatsappNumber) {
      res.status(400).json({ message: "Missing required fields." });
      return;
    }

    const message = `🚨 *Sepsis Alert* 🚨\nPatient: *${patientName}* (ID: *${patientId}*)\nSepsis Risk: *${sepsisRisk}%*\nImmediate medical attention is required.`;

    const url = `https://graph.facebook.com/v16.0/${process.env.WA_PHONE_ID}/messages`;

    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: whatsappNumber,
        type: "text",
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WA_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ message: "Sepsis alert sent via WhatsApp successfully!" });
  } catch (error) {
    console.error("WhatsApp sending error:", error);
    res.status(500).json({ error: "Failed to send WhatsApp alert." });
  }
};
