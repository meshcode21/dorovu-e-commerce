import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { 
  createOrder, 
  getOrders, 
  getPendingOrderCount,
  getOrderById, 
  updateOrderItemStatus, 
  cancelOrder,
  cancelPayment
} from '../controllers/order.controller';

const router = Router();

// Apply authentication to all order routes
router.use(authenticate);

// Buyer routes
router.post('/', createOrder);
router.post('/:id/cancel', cancelOrder);
router.post('/:id/cancel-payment', cancelPayment);

// Crafter routes
router.put('/items/:itemId/status', requireRole('CRAFTER', 'ADMIN'), updateOrderItemStatus);

// Shared routes
router.get('/', getOrders);
router.get('/pending-count', requireRole('CRAFTER'), getPendingOrderCount);
router.get('/:id', getOrderById);

export default router;
