import { Request, Response, NextFunction } from 'express';
import { CrafterService } from '../services/crafter.service';
import { ApplyCrafterSchema, UpdateCrafterStoreSchema } from '@dorovu/shared';

export const CrafterController = {
  async updateCrafterStore(req: Request, res: Response, next: NextFunction) {
    try {
      const bodyData = { ...req.body };
      
      let existingImages: string[] | null = null;
      if (bodyData.existingImages !== undefined) {
        if (typeof bodyData.existingImages === 'string') {
          try {
            existingImages = JSON.parse(bodyData.existingImages);
          } catch {
            existingImages = [bodyData.existingImages];
          }
        } else if (Array.isArray(bodyData.existingImages)) {
          existingImages = bodyData.existingImages;
        }
      }

      const validatedData = UpdateCrafterStoreSchema.parse(bodyData);
      const userId = req.user!.userId;

      // Extract new image files
      const newImages: string[] = [];
      if (req.files && Array.isArray(req.files)) {
        req.files.forEach((file: Express.Multer.File) => {
          newImages.push(file.path);
        });
      }

      const store = await CrafterService.updateCrafterStore(userId, validatedData, existingImages, newImages);
      
      res.json({
        success: true,
        data: store,
      });
    } catch (error) {
      next(error);
    }
  },

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
