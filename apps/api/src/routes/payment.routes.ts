import { Router } from 'express';
import { initiateEsewaPayment, verifyEsewaPayment } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Initiate requires user to be logged in (they are checking out)
router.post('/esewa/initiate', authenticate, initiateEsewaPayment);

// Verify is called by eSewa redirect, so it doesn't have our JWT cookie. It's public.
router.get('/esewa/verify', verifyEsewaPayment);

export default router;
