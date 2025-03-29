import express from "express";
import { sendWhatsAppAlert } from "../controllers/whatsappController";

const router = express.Router();

router.post("/send-whatsapp", sendWhatsAppAlert);

export default router;
