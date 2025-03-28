import { Request, Response, NextFunction } from 'express';
import { Op, Sequelize } from 'sequelize';
import { Patient } from '../models/patient.model';
import {VitalSigns} from '../models/patient.model';
import {LabResult} from '../models/patient.model';

// Get general analytics
export const getGeneralAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalPatients = await Patient.count();
    const activePatients = await Patient.count({ where: { status: 'Active' } });
    const criticalPatients = await Patient.count({ where: { status: 'Critical' } });
    const dischargedPatients = await Patient.count({ where: { status: 'Discharged' } });

    const earlyDetection = Math.floor(totalPatients * 0.65); // 65% for demo

    res.status(200).json({
      success: true,
      data: {
        total: totalPatients,
        resolved: dischargedPatients,
        active: activePatients + criticalPatients,
        detectionRate: {
          earlyDetection,
          totalCases: totalPatients
        },
        patientOutcomes: {
          recovered: dischargedPatients,
          underTreatment: activePatients,
          critical: criticalPatients
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get monthly data
export const getMonthlyData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentYear = new Date().getFullYear();
    const monthlyData = await Patient.findAll({
      attributes: [
        [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('createdAt')), 'month'],
        [Sequelize.fn('COUNT', '*'), 'cases']
      ],
      where: {
        createdAt: {
          [Op.between]: [new Date(`${currentYear}-01-01`), new Date(`${currentYear}-12-31`)]
        }
      },
      group: [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('createdAt'))],
      order: [['month', 'ASC']]
    });

    res.status(200).json({ success: true, data: monthlyData });
  } catch (error) {
    next(error);
  }
};

// Get department data
export const getDepartmentData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const departmentData = await Patient.findAll({
      attributes: ['department', [Sequelize.fn('COUNT', '*'), 'cases']],
      group: ['department'],
      order: [[Sequelize.literal('cases'), 'DESC']]
    });

    res.status(200).json({ success: true, data: departmentData });
  } catch (error) {
    next(error);
  }
};

// Get vital signs analytics
export const getVitalSignsAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vitalStats = await VitalSigns.findAll({
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('Temp')), 'avgTemp'],
        [Sequelize.fn('AVG', Sequelize.col('HR')), 'avgHR'],
        [Sequelize.fn('AVG', Sequelize.col('Resp')), 'avgResp']
      ]
    });

    res.status(200).json({ success: true, data: vitalStats });
  } catch (error) {
    next(error);
  }
};

// Get lab results analytics
export const getLabResultsAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const labStats = await LabResult.findAll({
      attributes: [
        'testType',
        [Sequelize.fn('AVG', Sequelize.col('Glucose')), 'avgGlucose'],
        [Sequelize.fn('AVG', Sequelize.col('Creatinine')), 'avgCreatinine']
      ],
      group: ['testType']
    });

    res.status(200).json({ success: true, data: labStats });
  } catch (error) {
    next(error);
  }
};
