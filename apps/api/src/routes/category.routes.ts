import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Public route to fetch categories
router.get('/', getCategories);

// Admin only routes for managing categories
router.post('/', authenticate, requireRole('ADMIN'), upload.single('image'), createCategory);
router.put('/:id', authenticate, requireRole('ADMIN'), upload.single('image'), updateCategory);
router.delete('/:id', authenticate, requireRole('ADMIN'), deleteCategory);

export default router;
