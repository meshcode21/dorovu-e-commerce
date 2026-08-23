import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// All admin routes require authentication and ADMIN role
router.use(authenticate, requireRole('ADMIN'));

router.get('/applications', AdminController.getApplications);
router.put('/applications/:id/approve', AdminController.approveApplication);
router.put('/applications/:id/reject', AdminController.rejectApplication);

export default router;
