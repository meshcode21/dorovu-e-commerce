'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Package, Truck, CheckCircle2, Clock, Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialTracking = searchParams.get('trackingNumber') || '';
  
  const [trackingNumber, setTrackingNumber] = useState(initialTracking);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!trackingNumber.trim()) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/orders/tracking/${trackingNumber}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || 'Tracking number not found');
      }

      setData(json.tracking);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTracking) {
      handleTrack();
    }
  }, [initialTracking]);

  const stages = [
    { status: 'PENDING', label: 'Order Placed', icon: Clock },
    { status: 'ACCEPTED', label: 'Processing', icon: Package },
    { status: 'READY_FOR_PICKUP', label: 'Ready for Pickup', icon: Package },
    { status: 'SHIPPED', label: 'In Transit', icon: Truck },
    { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: MapPin },
    { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
  ];

  const getStageIndex = (status: string) => {
    return stages.findIndex(s => s.status === status);
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 py-16 min-h-[70vh]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-display text-foreground mb-4">Track Your Package</h1>
        <p className="text-muted-foreground max-w-md mx-auto">Enter your Dorovu tracking number to see the real-time status of your handmade item.</p>
      </div>

      <form onSubmit={handleTrack} className="flex gap-2 max-w-md mx-auto mb-16">
        <Input 
          placeholder="e.g. DRV-A1B2C3D4" 
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="h-12 text-lg"
        />
        <Button type="submit" disabled={loading} className="h-12 px-8">
          {loading ? 'Tracking...' : <Search className="w-5 h-5" />}
        </Button>
      </form>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-center font-medium">
          {error}
        </div>
      )}

      {data && (
        <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border shrink-0">
              <Image 
                src={data.variant.product.images[0] || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80'}
                alt={data.variant.product.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{data.variant.product.title}</h2>
              <p className="text-muted-foreground mb-1">Variant: <span className="font-medium text-foreground">{data.variant.name}</span></p>
              <p className="text-muted-foreground">Crafter: <span className="font-medium text-foreground">{data.crafter.storeName}</span></p>
            </div>
            <div className="md:ml-auto text-left md:text-right">
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold mb-1">Tracking Number</p>
              <p className="font-mono text-xl font-bold text-primary">{data.trackingNumber}</p>
            </div>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 md:left-[50%] top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block"></div>
            
            <div className="space-y-8 relative">
              {stages.map((stage, idx) => {
                const currentIndex = getStageIndex(data.status);
                const isCompleted = idx <= currentIndex;
                const isCurrent = idx === currentIndex;
                const isCancelled = data.status === 'CANCELLED';
                
                const Icon = stage.icon;

                return (
                  <div key={stage.status} className="flex items-center md:justify-center gap-6 relative">
                    <div className="md:w-1/2 text-left md:text-right md:pr-12 order-2 md:order-1 hidden md:block">
                      <p className={`font-bold ${isCurrent ? 'text-primary text-lg' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {stage.label}
                      </p>
                      {isCurrent && !isCancelled && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {stage.status === 'OUT_FOR_DELIVERY' ? 'Agent is on the way. Please have your delivery PIN ready.' : 'Current status'}
                        </p>
                      )}
                    </div>

                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 order-1 md:order-2 z-10 border-4 border-card transition-colors ${
                      isCurrent && !isCancelled ? 'bg-primary text-white shadow-[0_0_15px_rgba(var(--primary),0.5)]' :
                      isCompleted && !isCancelled ? 'bg-primary/20 text-primary' :
                      isCancelled && isCurrent ? 'bg-destructive text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="md:w-1/2 text-left md:pl-12 order-3 md:hidden">
                       <p className={`font-bold ${isCurrent ? 'text-primary text-lg' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {stage.label}
                      </p>
                      {isCurrent && !isCancelled && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {stage.status === 'OUT_FOR_DELIVERY' ? 'Agent is on the way. Please have your delivery PIN ready.' : 'Current status'}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>}>
      <TrackingContent />
    </Suspense>
  );
}
