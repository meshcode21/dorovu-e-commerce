import { Router } from 'express';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../controllers/product.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected crafter routes
// We use upload.array('images', 5) to handle multiple file uploads (up to 5 images)
router.post('/', authenticate, requireRole('CRAFTER'), upload.array('images', 5), createProduct);
router.put('/:id', authenticate, requireRole('CRAFTER'), upload.array('images', 5), updateProduct);
router.delete('/:id', authenticate, requireRole('CRAFTER'), deleteProduct);

export default router;
