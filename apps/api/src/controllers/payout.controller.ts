import { Request, Response, NextFunction } from 'express';
import { AccountingService } from '../services/accounting.service';
import { AppError } from '../middleware/error.middleware';
import { prisma } from '../lib/prisma';

export const requestPayout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const crafterId = req.user!.userId;
    const { amount, method } = req.body;
    
    if (!amount || typeof amount !== 'number') {
      throw new AppError(400, 'Valid amount is required');
    }
    if (amount < 1000) {
      throw new AppError(400, 'Minimum withdrawal amount is Rs 1000');
    }
    if (!method) {
      throw new AppError(400, 'Payout method is required');
    }

    const payout = await AccountingService.processPayout(crafterId, amount, method);
    
    res.status(200).json({
      message: 'Payout requested successfully',
      data: payout
    });
  } catch (error: any) {
    if (error.message === 'Insufficient available balance') {
      next(new AppError(400, error.message));
    } else {
      next(error);
    }
  }
};

export const getPayoutHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const crafterId = req.user!.userId;

    const store = await prisma.crafterStore.findUnique({
      where: { crafterId },
      include: {
        ledgerTransactions: {
          orderBy: { createdAt: 'desc' }
        },
        payouts: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!store) {
      throw new AppError(404, 'Crafter store not found');
    }

    res.status(200).json({
      message: 'Payout history retrieved',
      data: {
        availableBalance: store.availableBalance,
        pendingBalance: store.pendingBalance,
        ledgerTransactions: store.ledgerTransactions,
        payouts: store.payouts
      }
    });
  } catch (error) {
    next(error);
  }
};
