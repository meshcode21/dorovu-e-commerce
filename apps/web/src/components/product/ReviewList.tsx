'use client';

import { useProductReviews } from '@/hooks/use-reviews';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { Star, MessageCircle } from 'lucide-react';

export default function ReviewList({ productId }: { productId: string }) {
  const { data: reviews, isLoading, isError } = useProductReviews(productId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500">Failed to load reviews.</div>;
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 bg-card rounded-xl border border-border">
        <p className="text-muted-foreground font-sans">No reviews yet for this product.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      <h3 className="font-display font-semibold text-2xl text-foreground mb-4">Reviews</h3>
      <div className="space-y-4">
        {reviews.map((review: any) => (
          <div key={review.id} className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">
                  {review.orderItem.order.buyer.firstName} {review.orderItem.order.buyer.lastName}
                </span>
                <span className="text-xs text-muted-foreground">
                  Purchased variant: {review.orderItem.variant.name}
                </span>
              </div>
              <div className="flex items-center text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>
            
            {review.comment && (
              <p className="text-muted-foreground mt-3 font-sans text-sm">
                {review.comment}
              </p>
            )}
            
            <p className="text-xs text-muted-foreground mt-2">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
            </p>

            {review.crafterReply && (
              <div className="mt-4 bg-muted/30 p-4 rounded-lg border border-border flex gap-3">
                <MessageCircle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">Crafter Response:</p>
                  <p className="text-sm text-muted-foreground font-sans">{review.crafterReply}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
