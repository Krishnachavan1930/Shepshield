import express from "express";
import { protect, restrictIo } from "../middleware/auth.middleware";
import { createPatient, deletePatient, getAllPatients, getPatient, updatePatient } from "../controllers/patient.controller";
import { addVitalSigns, getPatientVitals } from "../controllers/vitals.controller";
import { addLabResult, getPatientLab } from "../controllers/lab.controller";

const router = express.Router();


router.use(protect);

router.route('/')
    .get(getAllPatients)
    .post(createPatient);

router.route('/:id')
    .get(getPatient)
    .put(updatePatient)
    .delete(restrictIo('admin', 'doctor'), deletePatient);


router.route('/:id/vitals')
    .get(getPatientVitals)
    .post(addVitalSigns);


router.route('/:id/labs')
    .get(getPatientLab)
    .post(addLabResult);



export default router;