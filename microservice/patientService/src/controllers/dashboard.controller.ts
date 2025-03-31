import { Request, Response } from "express";
import { Patient } from "../models/patient.model";
import { Op, fn, col } from "sequelize";
import sequelize from "../config/db"; 

const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const activePatients = await Patient.count({
      where: { status: "Active", id: { [Op.between]: [1, 10] } },
    });

    
    const previousActivePatients = await Patient.count({
      where: {
        status: "Active",
        id: { [Op.between]: [1, 10] },
        createdAt: {
          [Op.between]: [
            new Date(new Date().setDate(new Date().getDate() - 14)),
            new Date(new Date().setDate(new Date().getDate() - 7)),
          ],
        },
      },
    });
    const activePatientsChange = activePatients - previousActivePatients;

    
    const predictedOutcomes = await Patient.count({
      where: {
        riskScore: {
          [Op.ne]: null,
        },
        id: { [Op.between]: [1, 10] },
      },
    });

    const riskScoreResult = await Patient.findOne({
      attributes: [[fn("AVG", col("riskScore")), "avgRiskScore"]],
      where: { id: { [Op.between]: [1, 10] } },
      raw: true,
    }) as { avgRiskScore?: number } | null;
    const averageRiskScore = riskScoreResult?.avgRiskScore || 0;

    const sepsisAlerts = await Patient.count({
      where: {
        riskLevel: "High",
        id: { [Op.between]: [1, 10] },
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sepsisAlertsChange = await Patient.count({
      where: {
        riskLevel: "High",
        id: { [Op.between]: [1, 10] },
        updatedAt: {
          [Op.gte]: today,
        },
      },
    });

    const departments = ["ICU", "Emergency", "General Medicine", "Cardiology", "Neurology", "Surgery", "Pediatrics"];
    const departmentCounts: Record<string, number> = {};

    for (const department of departments) {
      departmentCounts[department] = await Patient.count({
        where: { department },
      });
    }

    res.status(200).json({
      activePatients,
      activePatientsChange,
      sepsisAlerts,
      sepsisAlertsChange,
      predictedOutcomes,
      averageRiskScore,
      departmentCounts,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getDashboardStats };
