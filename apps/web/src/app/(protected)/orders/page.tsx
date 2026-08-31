'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useBuyerOrders, useCancelOrder } from '@/hooks/use-orders';
import { Package, Truck, CheckCircle2, Clock, XCircle, ArrowRight, MessageCircle, Star } from 'lucide-react';
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
      case 'READY_FOR_PICKUP': return <Package className="w-4 h-4 text-purple-500" />;
      case 'SHIPPED': return <Truck className="w-4 h-4 text-indigo-500" />;
      case 'OUT_FOR_DELIVERY': return <Truck className="w-4 h-4 text-orange-500" />;
      case 'DELIVERED': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'ACCEPTED': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'READY_FOR_PICKUP': return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'SHIPPED': return 'bg-indigo-500/10 text-indigo-600 border-indigo-200';
      case 'OUT_FOR_DELIVERY': return 'bg-orange-500/10 text-orange-600 border-orange-200';
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
                        <div className="mt-4 flex flex-col sm:flex-row gap-4">
                          <div className="bg-muted/50 rounded-lg p-3 text-sm flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border border-border">
                            <div>
                              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Tracking Number</p>
                              <p className="font-medium text-foreground">{item.trackingNumber}</p>
                            </div>
                            <Link href={`/tracking?trackingNumber=${item.trackingNumber}`}>
                              <Button variant="outline" size="sm" className="h-8 text-xs shrink-0 w-full sm:w-auto">Track Package</Button>
                            </Link>
                          </div>
                          
                          {item.deliveryOtp && (item.status === 'OUT_FOR_DELIVERY' || item.status === 'DELIVERED') && (
                            <div className={`rounded-lg p-3 text-sm sm:w-48 flex flex-col border ${item.status === 'DELIVERED' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-orange-500/10 border-orange-500/20'}`}>
                              <p className={`text-xs uppercase font-bold tracking-wider mb-1 ${item.status === 'DELIVERED' ? 'text-emerald-700 dark:text-emerald-400' : 'text-orange-700 dark:text-orange-400'}`}>
                                Delivery PIN
                              </p>
                              <p className={`font-mono font-bold text-lg tracking-widest ${item.status === 'DELIVERED' ? 'text-emerald-800 dark:text-emerald-300 line-through opacity-50' : 'text-orange-800 dark:text-orange-300'}`}>
                                {item.deliveryOtp}
                              </p>
                              {item.status === 'OUT_FOR_DELIVERY' && (
                                <p className="text-[10px] text-orange-600/80 dark:text-orange-400/80 leading-tight mt-1">Provide this to the agent</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {item.review && (
                        <div className="mt-4 bg-muted/20 border border-border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="text-sm font-semibold text-foreground">Your Review</h5>
                            <div className="flex text-yellow-500">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < item.review.rating ? 'fill-current' : 'text-gray-300'}`} />
                              ))}
                            </div>
                          </div>
                          {item.review.comment && <p className="text-sm text-muted-foreground mb-4">{item.review.comment}</p>}
                          
                          {item.review.crafterReply && (
                            <div className="mt-2 mb-4 bg-background p-3 rounded-md border border-border flex gap-3">
                              <MessageCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold text-foreground mb-1">Crafter's Response:</p>
                                <p className="text-sm text-muted-foreground font-sans">{item.review.crafterReply}</p>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex justify-end">
                            <ReviewForm 
                              orderItemId={item.id} 
                              productId={item.variant.product.id} 
                              existingReview={item.review} 
                            />
                          </div>
                        </div>
                      )}

                      {!item.review && item.status === 'DELIVERED' && (
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
