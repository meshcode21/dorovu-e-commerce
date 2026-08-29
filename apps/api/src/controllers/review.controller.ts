import { Request, Response, NextFunction } from 'express';
import { CreateReviewSchema, UpdateReviewSchema, ReplyReviewSchema } from '@dorovu/shared';
import * as reviewService from '../services/review.service';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const buyerId = req.user!.userId;
    const orderItemId = req.params.orderItemId as string;
    const data = CreateReviewSchema.parse(req.body);

    const review = await reviewService.createReview(buyerId, orderItemId, data);

    res.status(201).json({
      message: 'Review submitted successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const buyerId = req.user!.userId;
    const id = req.params.id as string;
    const data = UpdateReviewSchema.parse(req.body);

    const review = await reviewService.updateReview(buyerId, id, data);

    res.status(200).json({
      message: 'Review updated successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const buyerId = req.user!.userId;
    const id = req.params.id as string;

    await reviewService.deleteReview(buyerId, id);

    res.status(200).json({
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const reply = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const crafterUserId = req.user!.userId;
    const id = req.params.id as string;
    const data = ReplyReviewSchema.parse(req.body);

    const review = await reviewService.replyToReview(crafterUserId, id, data);

    res.status(200).json({
      message: 'Reply submitted successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};
