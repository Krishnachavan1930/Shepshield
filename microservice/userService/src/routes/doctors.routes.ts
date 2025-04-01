import express from "express";
import { createDoctor, deleteDoctor, GetAllDoctors, getDoctor, updateDoctor } from "../controllers/doctors.controller";
import { protect, restrictIo } from "../middleware/auth.middleware";
const router = express.Router();


router.get('/', GetAllDoctors);
router.get('/:id', getDoctor);

router.use(protect);
router.post('/', restrictIo('admin', 'doctor'), createDoctor);
router.put('/:id', restrictIo('admin', 'doctor'), updateDoctor);
router.delete('/:id', restrictIo('admin'), deleteDoctor);

export default router;