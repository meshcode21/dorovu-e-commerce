import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';
import { AppError } from '../middleware/error.middleware';

export const initiateEsewaPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.body;
    
    if (!orderId) {
      throw new AppError(400, 'Order ID is required');
    }

    // In a real app, you would also verify that this order belongs to req.user.id
    
    const formData = await PaymentService.initiateEsewaPayment(orderId);
    
    res.status(200).json({
      message: 'eSewa payment initiated successfully',
      data: formData
    });
  } catch (error: any) {
    next(error);
  }
};

export const verifyEsewaPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data } = req.query;

    if (!data || typeof data !== 'string') {
      throw new AppError(400, 'Payment data is missing or invalid');
    }

    const result = await PaymentService.verifyEsewaPayment(data);

    res.status(200).json({
      message: 'Payment verified successfully',
      data: result
    });
  } catch (error: any) {
    next(error);
  }
};
