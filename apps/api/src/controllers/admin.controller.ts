import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';
import { z } from 'zod';

const StatusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional();

export const AdminController = {
  async getApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const statusResult = StatusSchema.safeParse(req.query.status);
      const status = statusResult.success ? statusResult.data : undefined;
      
      const applications = await AdminService.getApplications(status);
      
      res.status(200).json({
        success: true,
        data: applications,
      });
    } catch (error) {
      next(error);
    }
  },

  async approveApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const application = await AdminService.approveApplication(id);
      
      res.status(200).json({
        success: true,
        data: application,
      });
    } catch (error) {
      next(error);
    }
  },

  async rejectApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const application = await AdminService.rejectApplication(id);
      
      res.status(200).json({
        success: true,
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }
};
