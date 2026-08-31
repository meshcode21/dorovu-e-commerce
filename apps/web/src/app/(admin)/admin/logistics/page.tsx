'use client';

import { useState } from 'react';
import { Truck, Search, CheckCircle2, Package, MapPin, Box, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAdminLogistics, useUpdateOrderStatus } from '@/hooks/use-orders';

export default function AdminTrackingPage() {
  const { data: logisticsList, isLoading: listLoading } = useAdminLogistics();
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();
  
  const [trackingNumber, setTrackingNumber] = useState('');
  const [data, setData] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setSearchLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/orders/tracking/${trackingNumber}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setData(json.tracking);
    } catch (error: any) {
      toast.error(error.message || 'Tracking number not found');
      setData(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleUpdateStatus = (newStatus: string) => {
    updateStatus(
      { itemId: data.id, status: newStatus, otp: newStatus === 'DELIVERED' ? otp : undefined } as any,
      {
        onSuccess: () => {
          if (newStatus === 'DELIVERED') setOtp('');
          // Re-fetch or simply clear the selected data
          setData(null);
        }
      }
    );
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground flex items-center gap-3">
          <Truck className="w-8 h-8 text-primary" />
          Logistics Portal
        </h1>
        <p className="text-muted-foreground mt-2">Manage Dorovu deliveries and update tracking states.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input 
            placeholder="Scan or enter Tracking Number (DRV-...)" 
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="font-mono text-lg"
          />
          <Button type="submit" disabled={searchLoading} className="px-8">
            <Search className="w-5 h-5 mr-2" /> Find
          </Button>
        </form>
      </div>

      {!data && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-display flex items-center gap-2">
            <Box className="w-5 h-5 text-primary" /> Active Logistics Packages
          </h2>
          
          {listLoading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted rounded-lg"></div>)}
            </div>
          ) : logisticsList?.length === 0 ? (
            <div className="text-center p-8 bg-muted/30 border border-border rounded-xl text-muted-foreground">
              No packages currently in logistics.
            </div>
          ) : (
            <div className="grid gap-3">
              {logisticsList?.map((item: any) => (
                <div 
                  key={item.id} 
                  onClick={() => setData(item)}
                  className="bg-card border border-border hover:border-primary/50 transition-colors rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer shadow-sm group"
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-bold text-foreground">{item.variant.product.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Tracking: <span className="font-mono font-medium text-foreground">{item.trackingNumber}</span> • Crafter: {item.crafter.storeName}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 justify-between sm:justify-end w-full sm:w-auto">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      item.status === 'READY_FOR_PICKUP' ? 'bg-purple-500/10 text-purple-600' :
                      item.status === 'SHIPPED' ? 'bg-indigo-500/10 text-indigo-600' :
                      item.status === 'OUT_FOR_DELIVERY' ? 'bg-orange-500/10 text-orange-600' :
                      item.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-600' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {item.status.replace(/_/g, ' ')}
                    </span>
                    <Button variant="ghost" size="icon" className="group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {data && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={() => setData(null)} className="text-muted-foreground hover:text-foreground">
              &larr; Back to List
            </Button>
          </div>
          <div className="bg-muted/30 border border-border rounded-xl p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold font-display mb-1">{data.variant.product.title}</h3>
                <p className="text-muted-foreground text-sm">Variant: {data.variant.name} • Qty: {data.quantity}</p>
              </div>
              <div className="text-right">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {data.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider mb-1">Crafter</p>
                <p className="font-medium">{data.crafter.storeName}</p>
              </div>
              <div>
                <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider mb-1">Tracking Number</p>
                <p className="font-mono font-bold">{data.trackingNumber}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Update Status</h3>
            
            {data.status === 'READY_FOR_PICKUP' && (
              <Button onClick={() => handleUpdateStatus('SHIPPED')} disabled={isPending} className="w-full h-12 text-lg">
                <Package className="w-5 h-5 mr-2" /> Mark as Picked Up (Shipped)
              </Button>
            )}

            {data.status === 'SHIPPED' && (
              <Button onClick={() => handleUpdateStatus('OUT_FOR_DELIVERY')} disabled={isPending} className="w-full h-12 text-lg bg-orange-600 hover:bg-orange-700 text-white">
                <MapPin className="w-5 h-5 mr-2" /> Mark Out for Delivery (Generates OTP)
              </Button>
            )}

            {data.status === 'OUT_FOR_DELIVERY' && (
              <div className="space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-4">
                  <p className="text-sm text-orange-800 dark:text-orange-400 font-medium">
                    This package is out for delivery. To complete the delivery and release funds to the crafter, ask the buyer for their 6-digit Delivery PIN.
                  </p>
                </div>
                
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Delivery PIN</label>
                  <Input 
                    placeholder="Enter 6-digit PIN" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="h-14 text-center font-mono text-2xl tracking-widest bg-muted/50"
                    maxLength={6}
                  />
                </div>
                <Button 
                  onClick={() => handleUpdateStatus('DELIVERED')} 
                  disabled={otp.length !== 6 || isPending}
                  className="w-full h-12 text-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Confirm Delivery
                </Button>
              </div>
            )}

            {data.status === 'DELIVERED' && (
              <div className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 p-6 rounded-lg text-center">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-500" />
                <h4 className="text-xl font-bold mb-1">Successfully Delivered</h4>
                <p className="text-sm">The funds have been released to the crafter.</p>
              </div>
            )}

            {['PENDING', 'ACCEPTED', 'CANCELLED'].includes(data.status) && (
              <div className="text-center p-6 text-muted-foreground">
                This item is currently {data.status}. No logistics actions available yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
