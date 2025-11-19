'use client';

import { useState, useEffect } from 'react';
import { useMarkets } from '@/hooks/useMarkets';
import { useSomniaDataStreams } from '@/hooks/useSomniaDataStreams';
import MarketCard from '@/components/MarketCard';
import LiveActivityFeed from '@/components/LiveActivityFeed';
import { Card, CardContent } from '@/components/ui/Card';
import { Search, Filter, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/utils/format';

export default function Home() {
  const { markets, loading } = useMarkets();
  const { isInitialized, error: sdkError } = useSomniaDataStreams();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredMarkets = markets.filter((market) => {
    const matchesSearch = market.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || market.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalVolume = markets.reduce((sum, m) => sum + parseFloat(m.totalPool), 0);
  const activeMarkets = markets.filter((m) => m.status === 'Active').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Prediction Markets
        </h1>
        <p className="text-lg text-gray-600">
          Bet on real-world events with real-time odds powered by Somnia Data Streams
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Volume</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(totalVolume)} STT
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Markets</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{activeMarkets}</p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Data Streams</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {isInitialized ? (
                    <span className="flex items-center text-lg">
                      <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse mr-2" />
                      Live
                    </span>
                  ) : (
                    <span className="text-lg text-gray-500">Connecting...</span>
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Markets Section */}
        <div className="lg:col-span-2">
          {/* Search and Filter */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search markets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <div className="flex gap-2">
                {['all', 'Active', 'Resolved'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filterStatus === status
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Markets Grid */}
          {loading ? (
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-shimmer">
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-20 bg-gray-200 rounded" />
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredMarkets.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No markets found</h3>
                <p className="text-gray-600">
                  {searchQuery
                    ? 'Try adjusting your search terms'
                    : 'New markets will appear here'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredMarkets.map((market) => (
                <MarketCard key={market.id} market={market} />
              ))}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <LiveActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
