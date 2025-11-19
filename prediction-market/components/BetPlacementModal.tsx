'use client';

import { useState } from 'react';
import { Market } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card';
import Button from './ui/Button';
import { formatCurrency, formatPercentage, calculatePayout } from '@/utils/format';
import { X, TrendingUp, AlertCircle } from 'lucide-react';

interface BetPlacementModalProps {
  market: Market;
  onClose: () => void;
  onPlaceBet: (outcomeIndex: number, amount: string) => Promise<void>;
}

export default function BetPlacementModal({ market, onClose, onPlaceBet }: BetPlacementModalProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<number>(0);
  const [amount, setAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const betAmount = parseFloat(amount);
    if (isNaN(betAmount) || betAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (betAmount < 0.001) {
      setError('Minimum bet is 0.001 STT');
      return;
    }

    setIsProcessing(true);
    try {
      await onPlaceBet(selectedOutcome, amount);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place bet');
    } finally {
      setIsProcessing(false);
    }
  };

  const currentOdds = market.odds[selectedOutcome] || 0;
  const totalPool = parseFloat(market.totalPool);
  const betAmount = parseFloat(amount) || 0;

  // Calculate potential payout
  const outcomePool = (totalPool * currentOdds) / 100;
  const newOutcomePool = outcomePool + betAmount;
  const newTotalPool = totalPool + betAmount;
  const potentialPayout = calculatePayout(betAmount, newOutcomePool, newTotalPool);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <CardTitle className="text-xl mb-2">Place Your Bet</CardTitle>
              <p className="text-sm text-gray-600 line-clamp-2">{market.question}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent>
            {/* Outcome Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Outcome
              </label>
              <div className="grid grid-cols-1 gap-2">
                {market.outcomes.map((outcome, index) => {
                  const odds = market.odds[index] || 0;
                  const isSelected = selectedOutcome === index;

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedOutcome(index)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                          {outcome}
                        </span>
                        <div className="text-right">
                          <div className={`text-sm font-semibold ${isSelected ? 'text-primary-700' : 'text-gray-700'}`}>
                            {formatPercentage(odds)}
                          </div>
                          <div className="text-xs text-gray-500">Current odds</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Bet Amount (STT)
              </label>
              <div className="relative">
                <input
                  id="amount"
                  type="number"
                  step="0.001"
                  min="0.001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                  {['0.5', '1', '5'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className="px-2 py-1 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">Minimum bet: 0.001 STT</p>
            </div>

            {/* Potential Payout */}
            {betAmount > 0 && (
              <div className="bg-success-50 border border-success-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-success-900">Potential Payout</span>
                  <TrendingUp className="w-4 h-4 text-success-600" />
                </div>
                <div className="text-2xl font-bold text-success-700">
                  {formatCurrency(potentialPayout)} STT
                </div>
                <div className="text-xs text-success-600 mt-1">
                  {potentialPayout > betAmount
                    ? `+${formatCurrency(potentialPayout - betAmount)} STT profit (${formatPercentage(
                        ((potentialPayout - betAmount) / betAmount) * 100,
                        0
                      )} return)`
                    : 'Break even'}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-danger-50 border border-danger-200 rounded-lg p-3 mb-4">
                <div className="flex items-center text-danger-800">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Fee Info */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Platform fee: 2% of total pool</p>
              <p>• Gas fees will be deducted from your wallet</p>
            </div>
          </CardContent>

          <CardFooter>
            <div className="flex gap-3 w-full">
              <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="success"
                className="flex-1"
                isLoading={isProcessing}
                disabled={!amount || parseFloat(amount) <= 0}
              >
                Place Bet
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
