'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { TrendingUp, TrendingDown, Clock, DollarSign } from 'lucide-react';
import { formatCurrency, formatPercentage, formatTimeRemaining } from '@/utils/format';
import Link from 'next/link';

export default function PortfolioPage() {
  // Mock user data - will be replaced with real data from contracts
  const userStats = {
    totalBets: 15,
    totalWagered: '24.5',
    totalWon: '31.2',
    winRate: 66.7,
    activeBets: 8,
    profit: '6.7',
  };

  const activeBets = [
    {
      marketId: '0',
      question: 'Will Bitcoin reach $100,000 by end of 2025?',
      outcome: 'Yes',
      amount: '2.5',
      currentOdds: 55,
      potentialPayout: '4.2',
      endTime: Math.floor(Date.now() / 1000) + 86400 * 30,
    },
    {
      marketId: '1',
      question: 'Will Ethereum outperform Bitcoin in Q1 2025?',
      outcome: 'Yes',
      amount: '1.8',
      currentOdds: 62,
      potentialPayout: '2.9',
      endTime: Math.floor(Date.now() / 1000) + 86400 * 45,
    },
  ];

  const completedBets = [
    {
      marketId: '5',
      question: 'Will any L2 reach 1M daily active users by Q4 2024?',
      outcome: 'Yes',
      amount: '3.0',
      payout: '5.5',
      profit: '2.5',
      won: true,
      resolvedAt: Math.floor(Date.now() / 1000) - 86400 * 5,
    },
    {
      marketId: '6',
      question: 'Will gas fees drop below 5 gwei in 2024?',
      outcome: 'No',
      amount: '1.5',
      payout: '0',
      profit: '-1.5',
      won: false,
      resolvedAt: Math.floor(Date.now() / 1000) - 86400 * 10,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Portfolio</h1>
        <p className="text-lg text-gray-600">Track your bets and earnings</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Wagered</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(userStats.totalWagered)} STT
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Won</p>
                <p className="text-2xl font-bold text-success-600 mt-1">
                  {formatCurrency(userStats.totalWon)} STT
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-success-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Profit</p>
                <p
                  className={`text-2xl font-bold mt-1 ${
                    parseFloat(userStats.profit) >= 0 ? 'text-success-600' : 'text-danger-600'
                  }`}
                >
                  {parseFloat(userStats.profit) >= 0 ? '+' : ''}
                  {formatCurrency(userStats.profit)} STT
                </p>
              </div>
              {parseFloat(userStats.profit) >= 0 ? (
                <TrendingUp className="w-10 h-10 text-success-600" />
              ) : (
                <TrendingDown className="w-10 h-10 text-danger-600" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Win Rate</p>
                <p className="text-2xl font-bold text-primary-600 mt-1">
                  {formatPercentage(userStats.winRate, 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {userStats.totalBets} total bets
                </p>
              </div>
              <div className="w-16 h-16">
                <svg className="transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="3"
                    strokeDasharray={`${userStats.winRate}, 100`}
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Bets */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Bets</h2>
        {activeBets.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No active bets</h3>
              <p className="text-gray-600">
                <Link href="/" className="text-primary-600 hover:text-primary-700">
                  Browse markets
                </Link>{' '}
                to place your first bet
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {activeBets.map((bet, index) => (
              <Card key={index} hover>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="success">Active</Badge>
                        <span className="text-xs text-gray-500">
                          Market #{bet.marketId}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {bet.question}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Your Bet</p>
                          <p className="font-semibold text-primary-600">{bet.outcome}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Amount</p>
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(bet.amount)} STT
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Current Odds</p>
                          <p className="font-semibold text-gray-900">
                            {formatPercentage(bet.currentOdds)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Potential Payout</p>
                          <p className="font-semibold text-success-600">
                            {formatCurrency(bet.potentialPayout)} STT
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatTimeRemaining(bet.endTime)}
                      </div>
                      <Link href={`/markets/${bet.marketId}`}>
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                          View Market →
                        </button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Completed Bets */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Betting History</h2>
        <div className="grid grid-cols-1 gap-4">
          {completedBets.map((bet, index) => (
            <Card key={index} hover>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={bet.won ? 'success' : 'danger'}>
                        {bet.won ? 'Won' : 'Lost'}
                      </Badge>
                      <span className="text-xs text-gray-500">Market #{bet.marketId}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {bet.question}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Your Bet</p>
                        <p className="font-semibold text-gray-900">{bet.outcome}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Amount</p>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(bet.amount)} STT
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Payout</p>
                        <p className={`font-semibold ${bet.won ? 'text-success-600' : 'text-gray-900'}`}>
                          {bet.won ? formatCurrency(bet.payout) : '—'} STT
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Profit/Loss</p>
                        <p
                          className={`font-semibold ${
                            parseFloat(bet.profit) >= 0 ? 'text-success-600' : 'text-danger-600'
                          }`}
                        >
                          {parseFloat(bet.profit) >= 0 ? '+' : ''}
                          {formatCurrency(bet.profit)} STT
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
