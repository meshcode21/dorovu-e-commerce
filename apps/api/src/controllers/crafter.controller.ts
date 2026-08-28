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

  async getCrafterById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const crafter = await CrafterService.getCrafterById(id as string);
      
      res.json({
        success: true,
        data: crafter,
      });
    } catch (error) {
      next(error);
    }
  },

  async getCrafterStore(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const store = await CrafterService.getCrafterStore(id as string);
      
      res.json({
        success: true,
        data: store,
      });
    } catch (error) {
      next(error);
    }
  },

  async getTopCrafters(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 4;
      const stores = await CrafterService.getTopCrafters(limit);
      
      res.json({
        success: true,
        data: stores,
      });
    } catch (error) {
      next(error);
    }
  },
};
