'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, History, Banknote, Loader2 } from 'lucide-react';

interface LedgerTransaction {
  id: string;
  amount: number;
  type: 'ORDER_SALE' | 'PLATFORM_FEE' | 'PAYOUT_WITHDRAWAL' | 'REFUND';
  description: string;
  createdAt: string;
}

interface PayoutData {
  availableBalance: number;
  pendingBalance: number;
  ledgerTransactions: LedgerTransaction[];
}

export default function PayoutsPage() {
  const [data, setData] = useState<PayoutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('ESEWA');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchHistory = async () => {
    try {
      const res = await api.get('/payouts/history');
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to fetch payout history', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 1000) {
      setError('Minimum withdrawal amount is Rs 1000');
      return;
    }
    
    if (data && numAmount > data.availableBalance) {
      setError('Amount exceeds available balance');
      return;
    }

    setIsRequesting(true);
    try {
      await api.post('/payouts/request', { amount: numAmount, method });
      setSuccess(`Successfully requested payout of Rs. ${numAmount}`);
      setAmount('');
      fetchHistory();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to request payout');
    } finally {
      setIsRequesting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center animate-pulse">Loading accounting data...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display text-foreground">Accounting & Payouts</h1>
        <p className="text-muted-foreground mt-2">Manage your earnings and request withdrawals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Balances Card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold flex items-center gap-2 mb-4">
            <Banknote className="w-5 h-5 text-[#60bb46]" /> Current Balances
          </h2>
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-xl border border-border">
              <p className="text-sm text-muted-foreground font-medium mb-1">Available for Withdrawal</p>
              <p className="text-3xl font-bold text-[#60bb46]">Rs. {data?.availableBalance.toLocaleString() || '0'}</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-xl border border-border">
              <p className="text-sm text-muted-foreground font-medium mb-1">Pending (In Escrow)</p>
              <p className="text-2xl font-semibold">Rs. {data?.pendingBalance.toLocaleString() || '0'}</p>
              <p className="text-xs text-muted-foreground mt-1">Funds will become available when orders are marked as DELIVERED.</p>
            </div>
          </div>
        </div>

        {/* Withdrawal Form */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-primary" /> Request Withdrawal
          </h2>
          
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Withdrawal Amount (Rs.)</Label>
              <Input 
                id="amount" 
                type="number" 
                min="1000" 
                placeholder="1000" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Minimum threshold: Rs. 1000</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Payout Method</Label>
              <select 
                id="method"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="ESEWA">eSewa Wallet</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
              </select>
            </div>

            {error && <p className="text-destructive text-sm font-medium">{error}</p>}
            {success && <p className="text-[#60bb46] text-sm font-medium">{success}</p>}

            <Button 
              type="submit" 
              className="w-full bg-primary" 
              disabled={isRequesting || (data?.availableBalance || 0) < 1000}
            >
              {isRequesting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : 'Submit Request'}
            </Button>
          </form>
        </div>
      </div>

      {/* Ledger History */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-primary" /> Ledger History
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Date</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3 text-right rounded-tr-lg">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data?.ledgerTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3">{tx.description}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      tx.type === 'ORDER_SALE' ? 'bg-blue-100 text-blue-800' :
                      tx.type === 'PLATFORM_FEE' ? 'bg-orange-100 text-orange-800' :
                      tx.type === 'PAYOUT_WITHDRAWAL' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${tx.amount > 0 ? 'text-[#60bb46]' : 'text-destructive'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
              
              {(!data?.ledgerTransactions || data.ledgerTransactions.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
