'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Activity, TrendingUp } from 'lucide-react';
import { formatAddress, formatCurrency, formatRelativeTime } from '@/utils/format';
import { useBetStream } from '@/hooks/useSomniaDataStreams';

interface ActivityItem {
  id: string;
  type: 'bet' | 'market_created' | 'market_resolved';
  user: string;
  marketId: string;
  marketQuestion?: string;
  amount?: string;
  outcome?: string;
  timestamp: number;
}

export default function LiveActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'bet',
      user: '0x1234567890123456789012345678901234567890',
      marketId: '0',
      marketQuestion: 'Will Bitcoin reach $100,000 by end of 2025?',
      amount: '2.5',
      outcome: 'Yes',
      timestamp: Math.floor(Date.now() / 1000) - 120,
    },
    {
      id: '2',
      type: 'bet',
      user: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      marketId: '1',
      marketQuestion: 'Will Ethereum outperform Bitcoin in Q1 2025?',
      amount: '1.8',
      outcome: 'No',
      timestamp: Math.floor(Date.now() / 1000) - 300,
    },
    {
      id: '3',
      type: 'bet',
      user: '0x9876543210987654321098765432109876543210',
      marketId: '0',
      marketQuestion: 'Will Bitcoin reach $100,000 by end of 2025?',
      amount: '0.5',
      outcome: 'No',
      timestamp: Math.floor(Date.now() / 1000) - 480,
    },
  ]);

  // Real-time updates from Data Streams
  const handleNewBet = useCallback((event: any) => {
    console.log('New bet in activity feed:', event);

    const newActivity: ActivityItem = {
      id: `bet-${Date.now()}`,
      type: 'bet',
      user: event.bettor || '0x0000000000000000000000000000000000000000',
      marketId: event.marketId?.toString() || '0',
      amount: event.amount?.toString() || '0',
      timestamp: event.timestamp || Math.floor(Date.now() / 1000),
    };

    setActivities((prev) => [newActivity, ...prev].slice(0, 20)); // Keep last 20
  }, []);

  useBetStream(handleNewBet);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'bet':
        return <TrendingUp className="w-4 h-4 text-success-600" />;
      default:
        return <Activity className="w-4 h-4 text-primary-600" />;
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'bet':
        return (
          <>
            <span className="font-semibold">{formatAddress(activity.user)}</span> bet{' '}
            <span className="font-semibold text-success-600">{formatCurrency(activity.amount || '0')} STT</span>
            {activity.outcome && (
              <>
                {' '}on <span className="font-semibold text-primary-600">{activity.outcome}</span>
              </>
            )}
          </>
        );
      default:
        return 'Unknown activity';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Activity className="w-5 h-5 mr-2 text-primary-600" />
            Live Activity
          </CardTitle>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse mr-2" />
            <span className="text-xs text-gray-500">Real-time</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No recent activity</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="mt-1">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{getActivityText(activity)}</p>
                  {activity.marketQuestion && (
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {activity.marketQuestion}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
