'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart, useUpdateCartItem, useRemoveCartItem, useClearCart } from '@/hooks/use-cart';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const user = useAuthStore((state) => state.user);
  const { data: cart, isLoading } = useCart(!!user);
  const { mutate: updateQuantity } = useUpdateCartItem();
  const { mutate: removeItem } = useRemoveCartItem();
  const { mutate: clearCart } = useClearCart();

  if (!user) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-3xl font-bold font-display mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Please log in to view and add items to your cart.</p>
        <Link href="/login">
          <Button className="bg-primary text-white">Log In to Shop</Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 bg-muted rounded w-32 mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-xl"></div>
            ))}
          </div>
          <div className="h-64 bg-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.variant.product.price + item.variant.priceAdjustment) * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-3xl font-bold font-display mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/products">
          <Button className="bg-primary text-white">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8 md:py-12">
      <div className="flex justify-between items-end mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground">Shopping Cart</h1>
        <Button variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => clearCart()}>
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const price = item.variant.product.price + item.variant.priceAdjustment;
            return (
              <div key={item.id} className="flex gap-4 p-4 bg-card rounded-xl border border-border items-center">
                <Link href={`/products/${item.variant.product.id}`} className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-background">
                  <Image 
                    src={item.variant.product.images[0] || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=400&auto=format&fit=crop'} 
                    alt={item.variant.product.title} 
                    fill 
                    className="object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.variant.product.id}`} className="font-medium text-foreground hover:text-primary truncate block mb-1">
                    {item.variant.product.title}
                  </Link>
                  <p className="text-sm text-muted-foreground mb-1">Variant: {item.variant.name}</p>
                  <p className="font-semibold text-primary">Rs. {price.toLocaleString()}</p>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">
                  <div className="flex items-center border border-border rounded-lg bg-background">
                    <button 
                      onClick={() => updateQuantity({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) })}
                      className="p-2 hover:text-primary transition-colors disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity({ itemId: item.id, quantity: item.quantity + 1 })}
                      className="p-2 hover:text-primary transition-colors disabled:opacity-50"
                      disabled={item.quantity >= item.variant.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-destructive text-sm flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
            <h2 className="text-xl font-bold font-display mb-4 border-b border-border pb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({items.length} items)</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between font-bold text-foreground text-lg pt-3 border-t border-border">
                <span>Total</span>
                <span className="text-primary">Rs. {subtotal.toLocaleString()}</span>
              </div>
            </div>

            <Link href="/checkout" className="block">
              <Button className="w-full h-12 text-base font-medium shadow-sm gap-2">
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
