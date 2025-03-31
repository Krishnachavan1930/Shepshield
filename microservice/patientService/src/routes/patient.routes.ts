import express from "express";
import multer from "multer";
import { protect, restrictIo } from "../middlewares/auth.middleware";
import { createPatient, deletePatient, getAllPatients, getPatient, getPatientProgress, updatePatient, uploadCSV } from "../controllers/patient.controller";
import { addVitalSigns, getPatientVitals } from "../controllers/vitals.controller";
import { addLabResult, getPatientLab } from "../controllers/lab.controller";

const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        console.log("File type received:", file.mimetype); // Debugging
        if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
            cb(null, true);
        } else {
            cb(new Error("Only CSV files are allowed!"));
        }
    }
});


router.post('/uploadcsv',upload.single("file"), uploadCSV)

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

router.get('/:id/progress', getPatientProgress);



export default router;