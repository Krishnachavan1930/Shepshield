import { Request, Response, NextFunction } from "express";
import VitalSigns from "../models/vitals.model";

export const getPatientVitals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const patientVitals = await VitalSigns.findOne({where : {
    //     patientId : req.params.id
    // }});
    const result = await VitalSigns.findAndCountAll({
      where: { patientId: req.params.id },
      order: [["recordedAt", "ASC"]], // Simplified order syntax
      limit: Math.ceil(
        (await VitalSigns.count({ where: { patientId: req.params.id } })) / 3
      ),
    });

    // Destructure the result
    const { rows: patientVitals, count: total } = result;

    if (!patientVitals) {
      res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.status(200).json({
      success: true,
      count: total,
      data: patientVitals,
    });
  } catch (err) {
    next(err);
  }
};

export const addVitalSigns = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;
    const patientVitals = await VitalSigns.create({
      patientId: req.params.id,
      data,
    });
    if (!patientVitals) {
      res.status(500).json({
        success: false,
        message: "Failed to add patient vitals",
      });
    }
    res.status(201).json({
      success: true,
      data: patientVitals,
    });
  } catch (err) {
    next(err);
  }
};
