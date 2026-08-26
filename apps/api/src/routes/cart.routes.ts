import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { 
  getCart, 
  addItemToCart, 
  updateCartItem, 
  removeCartItem, 
  clearCart 
} from '../controllers/cart.controller';

const router = Router();

// Apply authentication to all cart routes
router.use(authenticate);

router.get('/', getCart);
router.delete('/', clearCart);

router.post('/items', addItemToCart);
router.put('/items/:id', updateCartItem);
router.delete('/items/:id', removeCartItem);

export default router;
