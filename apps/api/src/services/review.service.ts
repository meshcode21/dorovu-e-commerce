import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';
import { CreateReviewDTO, UpdateReviewDTO, ReplyReviewDTO } from '@dorovu/shared';

// Helper to recalculate ratings for product and crafter within a transaction
const recalculateRatings = async (tx: any, productId: string, crafterId: string) => {
  // Recalculate Product rating
  const productStats = await tx.review.aggregate({
    where: { orderItem: { variant: { productId } } },
    _avg: { rating: true },
    _count: { rating: true },
  });

  const avgProductRating = productStats._avg.rating || 0;
  const totalReviews = productStats._count.rating || 0;

  await tx.product.update({
    where: { id: productId },
    data: {
      avgRating: avgProductRating,
      totalReviews: totalReviews,
    },
  });

  // Recalculate Crafter rating
  const crafterStats = await tx.review.aggregate({
    where: { orderItem: { crafterId } },
    _avg: { rating: true },
  });

  const avgCrafterRating = crafterStats._avg.rating || 0;

  await tx.crafterStore.update({
    where: { id: crafterId },
    data: {
      rating: avgCrafterRating,
    },
  });
};

export const createReview = async (
  buyerId: string,
  orderItemId: string,
  data: CreateReviewDTO
) => {
  // Check if order item exists, belongs to buyer, and is delivered
  const orderItem = await prisma.orderItem.findUnique({
    where: { id: orderItemId },
    include: {
      order: true,
      variant: true,
    },
  });

  if (!orderItem) {
    throw new AppError(404, 'Order item not found');
  }

  if (orderItem.order.buyerId !== buyerId) {
    throw new AppError(403, 'You did not purchase this item');
  }

  if (orderItem.status !== 'DELIVERED') {
    throw new AppError(400, 'You can only review delivered items');
  }

  // Check if review already exists
  const existingReview = await prisma.review.findUnique({
    where: { orderItemId },
  });

  if (existingReview) {
    throw new AppError(400, 'You have already reviewed this item');
  }

  // Create review and recalculate ratings in a transaction
  return await prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        orderItemId,
        rating: data.rating,
        comment: data.comment,
      },
    });

    await recalculateRatings(tx, orderItem.variant.productId, orderItem.crafterId);

    return review;
  });
};

export const updateReview = async (
  buyerId: string,
  reviewId: string,
  data: UpdateReviewDTO
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: {
      orderItem: {
        include: {
          order: true,
          variant: true,
        },
      },
    },
  });

  if (!review) {
    throw new AppError(404, 'Review not found');
  }

  if (review.orderItem.order.buyerId !== buyerId) {
    throw new AppError(403, 'You can only edit your own reviews');
  }

  return await prisma.$transaction(async (tx) => {
    const updatedReview = await tx.review.update({
      where: { id: reviewId },
      data: {
        rating: data.rating,
        comment: data.comment,
      },
    });

    // Rating might have changed
    if (data.rating !== undefined) {
      await recalculateRatings(tx, review.orderItem.variant.productId, review.orderItem.crafterId);
    }

    return updatedReview;
  });
};

export const deleteReview = async (buyerId: string, reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: {
      orderItem: {
        include: {
          order: true,
          variant: true,
        },
      },
    },
  });

  if (!review) {
    throw new AppError(404, 'Review not found');
  }

  if (review.orderItem.order.buyerId !== buyerId) {
    throw new AppError(403, 'You can only delete your own reviews');
  }

  await prisma.$transaction(async (tx) => {
    await tx.review.delete({
      where: { id: reviewId },
    });

    await recalculateRatings(tx, review.orderItem.variant.productId, review.orderItem.crafterId);
  });
};

export const replyToReview = async (
  crafterUserId: string,
  reviewId: string,
  data: ReplyReviewDTO
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: {
      orderItem: {
        include: {
          crafter: true,
        },
      },
    },
  });

  if (!review) {
    throw new AppError(404, 'Review not found');
  }

  if (review.orderItem.crafter.crafterId !== crafterUserId) {
    throw new AppError(403, 'You can only reply to reviews for your own products');
  }

  return await prisma.review.update({
    where: { id: reviewId },
    data: {
      crafterReply: data.crafterReply,
    },
  });
};
