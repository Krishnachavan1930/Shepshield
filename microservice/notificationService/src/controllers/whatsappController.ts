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
    console.log(message)
    const url = `https://graph.facebook.com/v16.0/647749335078869/messages`;
    console.log(process.env.WA_ACCESS_TOKEN);
    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: whatsappNumber as string, 
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
