import { Router } from 'express';
import { CrafterController } from '../controllers/crafter.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/apply', authenticate, CrafterController.applyCrafter);
router.get('/:id', CrafterController.getCrafterById);

export default router;
