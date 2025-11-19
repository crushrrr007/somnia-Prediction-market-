'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { useMarkets } from '@/hooks/useMarkets';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import BetPlacementModal from '@/components/BetPlacementModal';
import { formatCurrency, formatTimeRemaining, formatDate, formatPercentage, formatAddress } from '@/utils/format';
import { Clock, TrendingUp, Users, Calendar, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MarketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getMarketById } = useMarkets();
  const [showBetModal, setShowBetModal] = useState(false);
  const [market, setMarket] = useState(getMarketById(resolvedParams.id));

  useEffect(() => {
    setMarket(getMarketById(resolvedParams.id));
  }, [resolvedParams.id, getMarketById]);

  if (!market) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Market not found</h3>
            <p className="text-gray-600 mb-4">The market you're looking for doesn't exist.</p>
            <Link href="/">
              <Button variant="primary">Back to Markets</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePlaceBet = async (outcomeIndex: number, amount: string) => {
    console.log('Placing bet:', { marketId: market.id, outcomeIndex, amount });
    // TODO: Implement actual bet placement with smart contract
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  const totalBets = 156; // Mock data
  const recentBets = [
    {
      bettor: '0x1234567890123456789012345678901234567890',
      outcome: market.outcomes[0],
      amount: '2.5',
      timestamp: Math.floor(Date.now() / 1000) - 300,
    },
    {
      bettor: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      outcome: market.outcomes[1],
      amount: '1.8',
      timestamp: Math.floor(Date.now() / 1000) - 600,
    },
    {
      bettor: '0x9876543210987654321098765432109876543210',
      outcome: market.outcomes[0],
      amount: '0.5',
      timestamp: Math.floor(Date.now() / 1000) - 900,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Markets
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Market Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <Badge variant={market.status === 'Active' ? 'success' : 'info'}>
                  {market.status}
                </Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatTimeRemaining(market.endTime)}
                </div>
              </div>
              <CardTitle className="text-2xl">{market.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Pool</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(market.totalPool)} STT
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Participants</p>
                  <p className="text-xl font-bold text-gray-900">{market.participants || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Bets</p>
                  <p className="text-xl font-bold text-gray-900">{totalBets}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ends</p>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(market.endTime)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Outcomes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Market Outcomes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {market.outcomes.map((outcome, index) => {
                  const percentage = market.odds[index] || 0;
                  const pool = (parseFloat(market.totalPool) * percentage) / 100;

                  return (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-gray-900">{outcome}</h4>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary-600">
                            {formatPercentage(percentage)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatCurrency(pool)} STT pool
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-primary-600 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Bets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Bets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentBets.map((bet, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{formatAddress(bet.bettor)}</p>
                        <p className="text-sm text-gray-500">
                          Bet on <span className="font-medium text-primary-600">{bet.outcome}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(bet.amount)} STT</p>
                      <p className="text-xs text-gray-500">{formatDate(bet.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-6">
            {/* Place Bet Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Place Your Bet</CardTitle>
              </CardHeader>
              <CardContent>
                {market.status === 'Active' ? (
                  <>
                    <p className="text-sm text-gray-600 mb-4">
                      Choose an outcome and place your bet. Odds update in real-time.
                    </p>
                    <Button
                      onClick={() => setShowBetModal(true)}
                      variant="success"
                      className="w-full"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Place Bet
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-gray-600">
                    This market is {market.status.toLowerCase()} and no longer accepting bets.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Market Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Created by</span>
                    <span className="font-medium text-gray-900">
                      {formatAddress(market.creator)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Market ID</span>
                    <span className="font-mono text-xs text-gray-900">#{market.id}</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Platform Fee</span>
                    <span className="font-medium text-gray-900">2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Resolution</span>
                    <span className="font-medium text-gray-900">
                      {market.resolved ? 'Resolved' : 'Pending'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Real-time Status */}
            <Card className="bg-primary-50 border-primary-200">
              <CardContent className="p-4">
                <div className="flex items-center text-sm text-primary-900">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse mr-2" />
                  <span className="font-medium">Live odds powered by Somnia Data Streams</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bet Placement Modal */}
      {showBetModal && (
        <BetPlacementModal
          market={market}
          onClose={() => setShowBetModal(false)}
          onPlaceBet={handlePlaceBet}
        />
      )}
    </div>
  );
}
