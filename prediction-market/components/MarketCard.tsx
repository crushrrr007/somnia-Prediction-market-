'use client';

import { Market, MarketStatus } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { formatCurrency, formatTimeRemaining, formatPercentage } from '@/utils/format';
import { Clock, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

interface MarketCardProps {
  market: Market;
}

export default function MarketCard({ market }: MarketCardProps) {
  const getStatusBadge = () => {
    switch (market.status) {
      case MarketStatus.Active:
        return <Badge variant="success">Active</Badge>;
      case MarketStatus.Resolved:
        return <Badge variant="info">Resolved</Badge>;
      case MarketStatus.Closed:
        return <Badge variant="warning">Closed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const topOutcome = market.odds.indexOf(Math.max(...market.odds));

  return (
    <Card hover className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          {getStatusBadge()}
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            {formatTimeRemaining(market.endTime)}
          </div>
        </div>
        <CardTitle className="text-lg leading-tight">{market.question}</CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        {/* Outcomes with odds */}
        <div className="space-y-2 mb-4">
          {market.outcomes.map((outcome, index) => {
            const percentage = market.odds[index] || 0;
            const isTop = index === topOutcome;

            return (
              <div key={index} className="relative">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${isTop ? 'text-primary-700' : 'text-gray-700'}`}>
                    {outcome}
                  </span>
                  <span className={`text-sm font-semibold ${isTop ? 'text-primary-700' : 'text-gray-900'}`}>
                    {formatPercentage(percentage)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isTop ? 'bg-primary-600' : 'bg-gray-400'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 mr-2 text-success-600" />
            <div>
              <div className="text-xs text-gray-500">Total Pool</div>
              <div className="font-semibold text-gray-900">{formatCurrency(market.totalPool)} STT</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <Users className="w-4 h-4 mr-2 text-primary-600" />
            <div>
              <div className="text-xs text-gray-500">Participants</div>
              <div className="font-semibold text-gray-900">{market.participants || 0}</div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/markets/${market.id}`} className="w-full">
          <Button className="w-full" variant="primary">
            {market.status === MarketStatus.Active ? 'Place Bet' : 'View Details'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
