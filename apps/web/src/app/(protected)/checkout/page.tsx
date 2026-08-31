'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { shippingAddressSchema, ShippingAddressDTO } from '@dorovu/shared';
import { useCart } from '@/hooks/use-cart';
import { useCreateOrder } from '@/hooks/use-orders';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, ShieldCheck, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cart, isLoading } = useCart(true);
  const { mutate: createOrder, isPending } = useCreateOrder();
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);

  const form = useForm<ShippingAddressDTO>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      phone: '',
    },
  });

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.variant.product.price + item.variant.priceAdjustment) * item.quantity, 0);

  // Redirect if cart is empty
  useEffect(() => {
    if (!isLoading && items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, isLoading, router]);

  const onSubmit = (data: ShippingAddressDTO) => {
    if (items.length === 0) return;

    createOrder(
      {
        shippingAddress: data,
        items: items.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      },
      {
        onSuccess: async (res) => {
          try {
            setIsInitiatingPayment(true);
            const orderId = res.order.id;
            
            // Initiate eSewa Payment
            const paymentRes = await api.post('/payments/esewa/initiate', { orderId });
            const formData = paymentRes.data.data;

            // Dynamically create and submit eSewa form
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = formData.action;

            for (const key in formData) {
              if (key === 'action') continue;
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = key;
              input.value = formData[key];
              form.appendChild(input);
            }

            document.body.appendChild(form);
            form.submit();
          } catch (error) {
            console.error('Failed to initiate payment:', error);
            setIsInitiatingPayment(false);
            // Optionally redirect to orders if payment fails but order is created
            router.push('/orders');
          }
        },
        onError: () => {
          setIsInitiatingPayment(false);
        }
      }
    );
  };

  if (isLoading) {
    return <div className="max-w-[1280px] mx-auto px-4 py-20 animate-pulse text-center">Loading checkout...</div>;
  }

  if (items.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Shipping Form */}
        <div>
          <h2 className="text-xl font-bold font-display mb-6 border-b border-border pb-2">Shipping Information</h2>
          <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" {...form.register('fullName')} placeholder="John Doe" />
              {form.formState.errors.fullName && <p className="text-destructive text-sm">{form.formState.errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressLine1">Address Line 1</Label>
              <Input id="addressLine1" {...form.register('addressLine1')} placeholder="123 Main St" />
              {form.formState.errors.addressLine1 && <p className="text-destructive text-sm">{form.formState.errors.addressLine1.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
              <Input id="addressLine2" {...form.register('addressLine2')} placeholder="Apt 4B" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...form.register('city')} placeholder="Kathmandu" />
                {form.formState.errors.city && <p className="text-destructive text-sm">{form.formState.errors.city.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input id="state" {...form.register('state')} placeholder="Bagmati" />
                {form.formState.errors.state && <p className="text-destructive text-sm">{form.formState.errors.state.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" {...form.register('postalCode')} placeholder="44600" />
                {form.formState.errors.postalCode && <p className="text-destructive text-sm">{form.formState.errors.postalCode.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" {...form.register('phone')} placeholder="+977 9800000000" />
                {form.formState.errors.phone && <p className="text-destructive text-sm">{form.formState.errors.phone.message}</p>}
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-card rounded-2xl border border-border p-6 lg:p-8 sticky top-24 shadow-sm">
            <h2 className="text-xl font-bold font-display mb-6 border-b border-border pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden bg-background shrink-0 border border-border">
                    <Image 
                      src={item.variant.product.images[0] || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=400'} 
                      alt={item.variant.product.title} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-foreground truncate">{item.variant.product.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.variant.name} x {item.quantity}</p>
                  </div>
                  <div className="font-medium text-sm shrink-0">
                    Rs. {((item.variant.product.price + item.variant.priceAdjustment) * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6 pt-4 border-t border-border">
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Shipping</span>
                <span className="text-foreground font-medium">Free</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Payment Method</span>
                <span className="text-foreground font-medium text-[#60bb46]">eSewa Digital Wallet</span>
              </div>
              <div className="flex justify-between font-bold text-foreground text-lg pt-3 border-t border-border">
                <span>Total</span>
                <span className="text-primary">Rs. {subtotal.toLocaleString()}</span>
              </div>
            </div>

            <Button 
              type="submit" 
              form="checkout-form"
              className="w-full h-12 text-base font-medium shadow-md gap-2 bg-[#60bb46] hover:bg-[#52a33b] text-white"
              disabled={isPending || isInitiatingPayment}
            >
              {isPending || isInitiatingPayment ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
              ) : (
                <><img src="https://merchant.esewa.com.np/assets/img/esewa_logo.png" alt="eSewa" className="h-4 mr-1 brightness-0 invert" /> Pay with eSewa</>
              )}
            </Button>
            
            <div className="mt-4 flex justify-center items-center text-xs text-muted-foreground gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Your order is secured by Dorovu Buyer Protection
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
