import { Router } from 'express';
import { getCraftTypes, createCraftType, updateCraftType, deleteCraftType } from '../controllers/craft-type.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Public route to fetch craft types
router.get('/', getCraftTypes);

// Admin only routes for managing craft types
router.post('/', authenticate, requireRole('ADMIN'), createCraftType);
router.put('/:id', authenticate, requireRole('ADMIN'), updateCraftType);
router.delete('/:id', authenticate, requireRole('ADMIN'), deleteCraftType);

export default router;
