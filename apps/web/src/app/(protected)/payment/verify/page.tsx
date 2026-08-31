'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentVerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const data = searchParams.get('data');
  const statusParam = searchParams.get('status');
  const orderId = searchParams.get('orderId');

  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'cancelled'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (statusParam === 'failure' && orderId) {
      // User cancelled payment
      const cancelPayment = async () => {
        try {
          await api.post(`/orders/${orderId}/cancel-payment`);
          setStatus('cancelled');
          setMessage('Payment was cancelled. Your items have been restored to your cart.');
        } catch (error) {
          console.error('Failed to restore cart:', error);
          setStatus('error');
          setMessage('Payment was cancelled, but we could not fully restore your cart.');
        }
      };
      cancelPayment();
      return;
    }

    if (!data) {
      setStatus('error');
      setMessage('Missing payment data in the URL.');
      return;
    }

    const verifyPayment = async () => {
      try {
        await api.get(`/payments/esewa/verify?data=${data}`);
        setStatus('success');
        setMessage('Your payment was successful and the order is confirmed.');
      } catch (error: any) {
        console.error('Payment verification failed:', error);
        setStatus('error');
        setMessage(error.response?.data?.message || 'Payment verification failed. Please contact support if money was deducted.');
      }
    };

    verifyPayment();
  }, [data, statusParam, orderId]);

  return (
    <div className="max-w-[800px] mx-auto px-4 py-20 flex items-center justify-center min-h-[70vh]">
      <div className="bg-card border border-border rounded-3xl p-10 shadow-sm max-w-md w-full text-center space-y-6">
        
        {status === 'verifying' && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-16 h-16 text-[#60bb46] animate-spin" />
            <h2 className="text-2xl font-bold font-display">Verifying Payment...</h2>
            <p className="text-muted-foreground">Please wait while we verify your transaction with eSewa.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <CheckCircle className="w-16 h-16 text-[#60bb46]" />
            <h2 className="text-2xl font-bold font-display">Payment Successful!</h2>
            <p className="text-muted-foreground">{message}</p>
            <div className="pt-4 flex gap-4 w-full">
              <Button onClick={() => router.push('/orders')} className="w-full h-12 bg-[#60bb46] hover:bg-[#52a33b] text-white font-medium">
                View My Orders
              </Button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <XCircle className="w-16 h-16 text-destructive" />
            <h2 className="text-2xl font-bold font-display text-destructive">Payment Failed</h2>
            <p className="text-muted-foreground">{message}</p>
            <div className="pt-4 flex gap-4 w-full">
              <Button onClick={() => router.push('/cart')} variant="outline" className="w-full h-12 font-medium">
                Return to Cart
              </Button>
            </div>
          </div>
        )}

        {status === 'cancelled' && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <XCircle className="w-16 h-16 text-muted-foreground" />
            <h2 className="text-2xl font-bold font-display text-foreground">Payment Cancelled</h2>
            <p className="text-muted-foreground">{message}</p>
            <div className="pt-4 flex gap-4 w-full">
              <Button onClick={() => router.push('/cart')} variant="outline" className="w-full h-12 font-medium">
                Return to Cart
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
