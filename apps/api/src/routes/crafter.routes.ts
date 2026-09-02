import { Router } from 'express';
import { CrafterController } from '../controllers/crafter.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.get('/top', CrafterController.getTopCrafters);
router.post('/apply', authenticate, CrafterController.applyCrafter);
router.get('/:id', CrafterController.getCrafterById);
router.get('/:id/store', authenticate, CrafterController.getCrafterStore);
router.put('/store', authenticate, upload.array('images', 5), CrafterController.updateCrafterStore);

export default router;
