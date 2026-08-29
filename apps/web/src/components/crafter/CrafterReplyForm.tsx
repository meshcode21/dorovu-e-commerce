'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReplyReviewDTO, ReplyReviewSchema } from '@dorovu/shared';
import { useReplyReview } from '@/hooks/use-reviews';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface CrafterReplyFormProps {
  reviewId: string;
  productId: string;
  existingReply?: string | null;
}

export default function CrafterReplyForm({ reviewId, productId, existingReply }: CrafterReplyFormProps) {
  const [open, setOpen] = useState(false);
  const { mutate: replyReview, isPending } = useReplyReview(productId);
  
  const form = useForm<ReplyReviewDTO>({
    resolver: zodResolver(ReplyReviewSchema),
    defaultValues: {
      crafterReply: existingReply || '',
    },
  });

  const onSubmit = (data: ReplyReviewDTO) => {
    replyReview(
      { reviewId, data },
      {
        onSuccess: () => {
          toast.success('Reply submitted!');
          setOpen(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || 'Failed to submit reply');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="border-secondary text-secondary hover:bg-secondary/10" />}>
        {existingReply ? 'Edit Reply' : 'Reply to Buyer'}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{existingReply ? 'Edit Your Reply' : 'Reply to Review'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Response</label>
            <Textarea
              {...form.register('crafterReply')}
              placeholder="Thank the buyer or address any issues..."
              rows={4}
            />
            {form.formState.errors.crafterReply && (
              <p className="text-sm text-red-500">{form.formState.errors.crafterReply.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-secondary text-white hover:bg-secondary/90" 
            disabled={isPending}
          >
            {isPending ? 'Submitting...' : 'Submit Reply'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
