'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCrafterOrders, useUpdateOrderStatus } from '@/hooks/use-orders';
import { Button } from '@/components/ui/button';
import { Package, Truck, CheckCircle2, Clock, XCircle, MapPin, User, FileText, Star, MessageCircle } from 'lucide-react';
import CrafterReplyForm from '@/components/crafter/CrafterReplyForm';

export default function CrafterOrdersPage() {
  const { data: orderItems, isLoading } = useCrafterOrders();
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  // Local state for tracking numbers being edited
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-muted rounded w-48 mb-8"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-muted rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (!orderItems || orderItems.length === 0) {
    return (
      <div className="text-center py-20 bg-card rounded-2xl border border-border mt-6">
        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
        <h2 className="text-2xl font-bold font-display mb-2">No Orders Yet</h2>
        <p className="text-muted-foreground">When customers purchase your items, they will appear here.</p>
      </div>
    );
  }

  const handleStatusChange = (itemId: string, newStatus: string) => {
    const trackingNumber = trackingInputs[itemId];
    updateStatus({ itemId, status: newStatus, trackingNumber });
  };

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

  const getAvailableOptions = (currentStatus: string) => {
    if (currentStatus === 'PENDING') return [{ value: 'PENDING', label: 'Pending' }, { value: 'ACCEPTED', label: 'Accept Order' }];
    if (currentStatus === 'ACCEPTED') return [{ value: 'ACCEPTED', label: 'Accepted' }, { value: 'READY_FOR_PICKUP', label: 'Ready for Pickup' }];
    if (currentStatus === 'READY_FOR_PICKUP') return [{ value: 'READY_FOR_PICKUP', label: 'Ready for Pickup' }];
    if (currentStatus === 'SHIPPED') return [{ value: 'SHIPPED', label: 'Shipped' }];
    if (currentStatus === 'OUT_FOR_DELIVERY') return [{ value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' }];
    if (currentStatus === 'DELIVERED') return [{ value: 'DELIVERED', label: 'Delivered' }];
    if (currentStatus === 'CANCELLED') return [{ value: 'CANCELLED', label: 'Cancelled' }];
    return [{ value: currentStatus, label: currentStatus }];
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-display text-foreground">Order Management</h1>
        <p className="text-muted-foreground mt-1">Manage and fulfill your customer orders.</p>
      </div>

      <div className="space-y-6">
        {orderItems.map((item: any) => {
          const { order, variant } = item;
          const { product } = variant;
          const { buyer, shippingAddress } = order;

          return (
            <div key={item.id} className="bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col md:flex-row">
              {/* Product Info */}
              <div className="p-6 border-b md:border-b-0 md:border-r border-border md:w-2/5 lg:w-1/3 bg-muted/10">
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 rounded-md overflow-hidden bg-background shrink-0 border border-border">
                    <Image
                      src={product.images[0] || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80'}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground line-clamp-2 leading-tight mb-1">{product.title}</h3>
                    <p className="text-sm text-muted-foreground">Variant: <span className="font-medium text-foreground">{variant.name}</span></p>
                    <p className="text-sm text-muted-foreground">Quantity: <span className="font-medium text-foreground">{item.quantity}</span></p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Price at purchase:</span>
                    <span className="font-medium">Rs. {item.priceAtPurchase.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-primary">
                    <span>Total Earning:</span>
                    <span>Rs. {(item.priceAtPurchase * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Order & Fulfillment Details */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                  {/* Buyer Info */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <User className="w-4 h-4" /> Customer Details
                    </h4>
                    <div className="text-sm">
                      <p className="font-medium text-foreground">{buyer.firstName} {buyer.lastName}</p>
                      <p className="text-muted-foreground">{buyer.email}</p>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" /> Shipping Address
                    </h4>
                    <div className="text-sm text-muted-foreground max-w-[250px]">
                      <p className="text-foreground">{shippingAddress.fullName}</p>
                      <p>{shippingAddress.addressLine1}</p>
                      {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                      <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
                      <p className="mt-1 flex items-center gap-1">
                        Phone: <span className="text-foreground">{shippingAddress.phone}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fulfillment Action Area */}
                <div className="mt-auto bg-muted/30 rounded-lg border border-border p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex flex-col items-start gap-2">
                    <div className='flex items-center gap-1'>
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Order: <span className="uppercase text-muted-foreground">#{order.id.split('-')[0]}</span></span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <span className="text-muted-foreground text-sm px-2">•</span>
                      <span className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    {/* Tracking Number Display */}
                    {(item.status === 'ACCEPTED' || item.status === 'READY_FOR_PICKUP' || item.status === 'SHIPPED' || item.status === 'OUT_FOR_DELIVERY' || item.status === 'DELIVERED') && item.trackingNumber && (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                        <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Tracking:</span>
                        <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-md font-mono text-sm font-bold border border-primary/20">
                          {item.trackingNumber}
                        </div>
                      </div>
                    )}

                    {/* Status Action Buttons */}
                    <div className="w-full sm:w-auto flex items-center gap-2">
                      {item.status === 'PENDING' && (
                        <Button
                          onClick={() => handleStatusChange(item.id, 'ACCEPTED')}
                          disabled={isPending}
                          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Accept Order
                        </Button>
                      )}

                      {item.status === 'ACCEPTED' && (
                        <Button
                          onClick={() => handleStatusChange(item.id, 'READY_FOR_PICKUP')}
                          disabled={isPending}
                          className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Package className="w-4 h-4 mr-2" />
                          Mark Ready for Pickup
                        </Button>
                      )}

                      {/* Display a badge for states where the crafter has no actions left */}
                      {(item.status === 'READY_FOR_PICKUP' || item.status === 'SHIPPED' || item.status === 'OUT_FOR_DELIVERY' || item.status === 'DELIVERED' || item.status === 'CANCELLED') && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border border-border rounded-md font-medium text-sm">
                          {getStatusIcon(item.status)}
                          <span className="capitalize">{item.status.replace(/_/g, ' ').toLowerCase()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Buyer Review Section */}
                {item.review && (
                  <div className="mt-4 bg-muted/20 border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="text-sm font-semibold text-foreground">Buyer Review</h5>
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
                          <p className="text-xs font-semibold text-foreground mb-1">Your Response:</p>
                          <p className="text-sm text-muted-foreground font-sans">{item.review.crafterReply}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <CrafterReplyForm
                        reviewId={item.review.id}
                        productId={product.id}
                        existingReply={item.review.crafterReply}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
