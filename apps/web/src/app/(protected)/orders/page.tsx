'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useBuyerOrders, useCancelOrder } from '@/hooks/use-orders';
import { Package, Truck, CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ReviewForm from '@/components/order/ReviewForm';

export default function BuyerOrdersPage() {
  const { data: orders, isLoading } = useBuyerOrders();
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

  if (isLoading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 bg-muted rounded w-48 mb-8"></div>
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-muted rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-20 text-center">
        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-3xl font-bold font-display mb-4">No Orders Yet</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't placed any orders yet. Discover handmade crafts and support local artisans.</p>
        <Link href="/products">
          <Button className="bg-primary text-white">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'ACCEPTED': return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      case 'SHIPPED': return <Truck className="w-4 h-4 text-indigo-500" />;
      case 'DELIVERED': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'ACCEPTED': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'SHIPPED': return 'bg-indigo-500/10 text-indigo-600 border-indigo-200';
      case 'DELIVERED': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'CANCELLED': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order: any) => (
          <div key={order.id} className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            {/* Order Header */}
            <div className="bg-muted/30 px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground mb-0.5">Order Placed</p>
                  <p className="font-medium text-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">Total Amount</p>
                  <p className="font-medium text-foreground">Rs. {order.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">Order ID</p>
                  <p className="font-medium text-foreground uppercase">#{order.id.split('-')[0]}</p>
                </div>
              </div>
              
              {/* Cancel Button */}
              {order.paymentStatus === 'PENDING' && order.orderItems.every((item: any) => item.status === 'PENDING' || item.status === 'ACCEPTED') && (
                <AlertDialog>
                  <AlertDialogTrigger 
                    render={
                      <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                        Cancel Order
                      </Button>
                    }
                  />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently cancel your entire order.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Order</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => cancelOrder(order.id)}
                        className="bg-destructive text-white hover:bg-destructive/90"
                      >
                        Yes, cancel it
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>

            {/* Order Items */}
            <div className="p-6">
              <div className="space-y-6">
                {order.orderItems.map((item: any) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-border last:border-0 last:pb-0">
                    <Link href={`/products/${item.variant.product.id}`} className="relative w-24 h-24 rounded-lg overflow-hidden bg-background shrink-0 border border-border">
                      <Image 
                        src={item.variant.product.images[0] || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80'} 
                        alt={item.variant.product.title} 
                        fill 
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-2">
                        <div>
                          <Link href={`/products/${item.variant.product.id}`} className="font-bold text-foreground hover:text-primary text-lg truncate block mb-1">
                            {item.variant.product.title}
                          </Link>
                          <p className="text-sm text-muted-foreground mb-2">Variant: {item.variant.name}</p>
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                            {getStatusIcon(item.status)}
                            {item.status}
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="font-bold text-primary mb-1">Rs. {item.priceAtPurchase.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>

                      {item.trackingNumber && (
                        <div className="mt-4 bg-muted/50 rounded-lg p-3 text-sm flex items-center justify-between">
                          <span className="text-muted-foreground">Tracking Number: <span className="font-medium text-foreground">{item.trackingNumber}</span></span>
                          <Button variant="outline" size="sm" className="h-8 text-xs">Track Package</Button>
                        </div>
                      )}

                      {item.status === 'DELIVERED' && (
                        <div className="mt-4 flex justify-end">
                          <ReviewForm 
                            orderItemId={item.id} 
                            productId={item.variant.product.id} 
                            existingReview={item.review} 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
