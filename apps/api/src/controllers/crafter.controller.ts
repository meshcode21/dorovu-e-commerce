import { Request, Response, NextFunction } from 'express';
import { CrafterService } from '../services/crafter.service';
import { ApplyCrafterSchema } from '@dorovu/shared';

export const CrafterController = {
  async applyCrafter(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = ApplyCrafterSchema.parse(req.body);
      const userId = req.user!.userId;

      const application = await CrafterService.applyCrafter(userId, validatedData);
      
      res.status(201).json({
        success: true,
        data: application,
      });
    } catch (error) {
      next(error);
    }
  },
};
