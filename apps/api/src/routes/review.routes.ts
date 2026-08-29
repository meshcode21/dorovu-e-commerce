import { Router } from 'express';
import * as reviewController from '../controllers/review.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Buyer endpoints
router.post('/:orderItemId', authenticate, reviewController.create);
router.put('/:id', authenticate, reviewController.update);
router.delete('/:id', authenticate, reviewController.remove);

// Crafter endpoints
router.put('/:id/reply', authenticate, requireRole('CRAFTER'), reviewController.reply);

export default router;
