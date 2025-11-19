'use client';

import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Activity, TrendingUp, Users, Trophy } from 'lucide-react';
import { formatAddress, formatCurrency, formatRelativeTime } from '@/utils/format';

export default function ActivityPage() {
  // Mock activity data
  const activities = [
    {
      id: '1',
      type: 'bet',
      user: '0x1234567890123456789012345678901234567890',
      marketId: '0',
      marketQuestion: 'Will Bitcoin reach $100,000 by end of 2025?',
      amount: '2.5',
      outcome: 'Yes',
      timestamp: Math.floor(Date.now() / 1000) - 300,
    },
    {
      id: '2',
      type: 'market_created',
      user: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      marketId: '3',
      marketQuestion: 'Will a new L1 blockchain launch in Q1 2025?',
      timestamp: Math.floor(Date.now() / 1000) - 600,
    },
    {
      id: '3',
      type: 'bet',
      user: '0x9876543210987654321098765432109876543210',
      marketId: '1',
      marketQuestion: 'Will Ethereum outperform Bitcoin in Q1 2025?',
      amount: '1.8',
      outcome: 'No',
      timestamp: Math.floor(Date.now() / 1000) - 900,
    },
    {
      id: '4',
      type: 'market_resolved',
      marketId: '5',
      marketQuestion: 'Will any L2 reach 1M daily active users by Q4 2024?',
      winningOutcome: 'Yes',
      totalPool: '45.2',
      timestamp: Math.floor(Date.now() / 1000) - 86400,
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'bet':
        return <TrendingUp className="w-5 h-5 text-success-600" />;
      case 'market_created':
        return <Users className="w-5 h-5 text-primary-600" />;
      case 'market_resolved':
        return <Trophy className="w-5 h-5 text-yellow-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActivityTitle = (activity: any) => {
    switch (activity.type) {
      case 'bet':
        return 'Bet Placed';
      case 'market_created':
        return 'Market Created';
      case 'market_resolved':
        return 'Market Resolved';
      default:
        return 'Activity';
    }
  };

  const getActivityDescription = (activity: any) => {
    switch (activity.type) {
      case 'bet':
        return (
          <>
            <span className="font-semibold">{formatAddress(activity.user)}</span> bet{' '}
            <span className="font-semibold text-success-600">
              {formatCurrency(activity.amount)} STT
            </span>{' '}
            on <span className="font-semibold text-primary-600">{activity.outcome}</span>
          </>
        );
      case 'market_created':
        return (
          <>
            <span className="font-semibold">{formatAddress(activity.user)}</span> created a new
            market
          </>
        );
      case 'market_resolved':
        return (
          <>
            Market resolved with winning outcome:{' '}
            <span className="font-semibold text-success-600">{activity.winningOutcome}</span>
            <br />
            Total pool: {formatCurrency(activity.totalPool)} STT
          </>
        );
      default:
        return 'Unknown activity';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Platform Activity</h1>
        <p className="text-lg text-gray-600">
          Real-time updates from across all prediction markets
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-primary-600" />
              Recent Activity
            </h2>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse mr-2" />
              <span className="text-sm text-gray-500">Live</span>
            </div>
          </div>

          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className="mt-1">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant={
                        activity.type === 'bet'
                          ? 'success'
                          : activity.type === 'market_created'
                          ? 'info'
                          : 'warning'
                      }
                    >
                      {getActivityTitle(activity)}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 mb-1">
                    {getActivityDescription(activity)}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {activity.marketQuestion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
