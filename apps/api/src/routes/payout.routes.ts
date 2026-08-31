import { Router } from 'express';
import { requestPayout, getPayoutHistory } from '../controllers/payout.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Only crafters can request payouts
router.post('/request', authenticate, requireRole('CRAFTER'), requestPayout);
router.get('/history', authenticate, requireRole('CRAFTER'), getPayoutHistory);

export default router;
