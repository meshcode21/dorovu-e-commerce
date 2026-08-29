'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateReviewDTO, CreateReviewSchema } from '@dorovu/shared';
import { useCreateReview, useUpdateReview } from '@/hooks/use-reviews';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

interface ReviewFormProps {
  orderItemId: string;
  productId: string;
  existingReview?: {
    id: string;
    rating: number;
    comment: string | null;
  } | null;
}

export default function ReviewForm({ orderItemId, productId, existingReview }: ReviewFormProps) {
  const [open, setOpen] = useState(false);
  const { mutate: createReview, isPending: isCreating } = useCreateReview(productId);
  const { mutate: updateReview, isPending: isUpdating } = useUpdateReview(productId);
  
  const form = useForm<CreateReviewDTO>({
    resolver: zodResolver(CreateReviewSchema),
    defaultValues: {
      rating: existingReview?.rating || 5,
      comment: existingReview?.comment || '',
    },
  });

  const rating = form.watch('rating');

  const onSubmit = (data: CreateReviewDTO) => {
    if (existingReview) {
      updateReview(
        { reviewId: existingReview.id, data },
        {
          onSuccess: () => {
            toast.success('Review updated!');
            setOpen(false);
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update review');
          },
        }
      );
    } else {
      createReview(
        { orderItemId, data },
        {
          onSuccess: () => {
            toast.success('Review submitted!');
            setOpen(false);
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to submit review');
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant={existingReview ? 'outline' : 'default'} size="sm" />}>
        {existingReview ? 'Edit Review' : 'Leave a Review'}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{existingReview ? 'Edit Your Review' : 'Write a Review'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="flex flex-col items-center gap-2">
            <label className="text-sm font-medium">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => form.setValue('rating', star)}
                  className="focus:outline-none transition-colors"
                >
                  <Star
                    className={`w-8 h-8 ${star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
                  />
                </button>
              ))}
            </div>
            {form.formState.errors.rating && (
              <p className="text-sm text-red-500">{form.formState.errors.rating.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Comment (Optional)</label>
            <Textarea
              {...form.register('comment')}
              placeholder="Tell others what you think about this handmade item..."
              rows={4}
            />
            {form.formState.errors.comment && (
              <p className="text-sm text-red-500">{form.formState.errors.comment.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary text-white hover:bg-primary/90" 
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
