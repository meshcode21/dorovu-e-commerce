import { prisma } from '../lib/prisma';

/**
 * Updates the average rating and total reviews for a product
 * by aggregating all reviews associated with its order items.
 * 
 * This should be triggered whenever a new review is added, updated, or deleted.
 */
export const updateProductAverageRating = async (productId: string) => {
  const result = await prisma.review.aggregate({
    where: {
      orderItem: {
        variant: {
          productId: productId,
        },
      },
    },
    _avg: {
      rating: true,
    },
    _count: {
      id: true,
    },
  });

  const avgRating = result._avg.rating || 0;
  const totalReviews = result._count.id || 0;

  // Round to 1 decimal place (e.g. 4.5)
  const roundedAvgRating = Math.round(avgRating * 10) / 10;

  await prisma.product.update({
    where: { id: productId },
    data: {
      avgRating: roundedAvgRating,
      totalReviews,
    },
  });

  return { avgRating: roundedAvgRating, totalReviews };
};
