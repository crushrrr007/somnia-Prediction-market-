'use client';

import { useState, useEffect, useCallback } from 'react';
import { Market, MarketStatus } from '@/types';
import { useBetStream, useOddsStream, useMarketResolutionStream } from './useSomniaDataStreams';

// Mock data for development - will be replaced with real contract calls
const MOCK_MARKETS: Market[] = [
  {
    id: '0',
    question: 'Will Bitcoin reach $100,000 by end of 2025?',
    outcomes: ['Yes', 'No'],
    endTime: Math.floor(Date.now() / 1000) + 86400 * 30,
    resolutionTime: 0,
    creator: '0x1234567890123456789012345678901234567890',
    resolved: false,
    winningOutcome: 0,
    totalPool: '12.5',
    status: MarketStatus.Active,
    odds: [55, 45],
    volume24h: '2.3',
    participants: 127,
  },
  {
    id: '1',
    question: 'Will Ethereum outperform Bitcoin in Q1 2025?',
    outcomes: ['Yes', 'No'],
    endTime: Math.floor(Date.now() / 1000) + 86400 * 45,
    resolutionTime: 0,
    creator: '0x1234567890123456789012345678901234567890',
    resolved: false,
    winningOutcome: 0,
    totalPool: '8.7',
    status: MarketStatus.Active,
    odds: [62, 38],
    volume24h: '1.8',
    participants: 89,
  },
  {
    id: '2',
    question: 'Will any major sports team adopt blockchain for ticketing in 2025?',
    outcomes: ['Yes', 'No', 'Multiple Teams'],
    endTime: Math.floor(Date.now() / 1000) + 86400 * 60,
    resolutionTime: 0,
    creator: '0x1234567890123456789012345678901234567890',
    resolved: false,
    winningOutcome: 0,
    totalPool: '5.2',
    status: MarketStatus.Active,
    odds: [40, 35, 25],
    volume24h: '0.9',
    participants: 54,
  },
];

export function useMarkets() {
  const [markets, setMarkets] = useState<Market[]>(MOCK_MARKETS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Real-time updates from Data Streams
  const handleBetUpdate = useCallback((event: any) => {
    console.log('Bet placed event:', event);
    // Update market odds in real-time
    setMarkets((prev) =>
      prev.map((market) => {
        if (market.id === event.marketId?.toString()) {
          return {
            ...market,
            totalPool: (parseFloat(market.totalPool) + parseFloat(event.amount || 0)).toString(),
          };
        }
        return market;
      })
    );
  }, []);

  const handleOddsUpdate = useCallback((event: any) => {
    console.log('Odds updated event:', event);
    setMarkets((prev) =>
      prev.map((market) => {
        if (market.id === event.marketId?.toString()) {
          return {
            ...market,
            odds: event.odds || market.odds,
          };
        }
        return market;
      })
    );
  }, []);

  const handleMarketResolution = useCallback((event: any) => {
    console.log('Market resolved event:', event);
    setMarkets((prev) =>
      prev.map((market) => {
        if (market.id === event.marketId?.toString()) {
          return {
            ...market,
            resolved: true,
            winningOutcome: event.winningOutcome || 0,
            status: MarketStatus.Resolved,
          };
        }
        return market;
      })
    );
  }, []);

  // Subscribe to real-time updates
  useBetStream(handleBetUpdate);
  useOddsStream(handleOddsUpdate);
  useMarketResolutionStream(handleMarketResolution);

  const fetchMarkets = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Fetch from smart contract
      // For now, using mock data
      await new Promise((resolve) => setTimeout(resolve, 500));
      setMarkets(MOCK_MARKETS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch markets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  const getMarketById = useCallback(
    (id: string) => {
      return markets.find((m) => m.id === id);
    },
    [markets]
  );

  const getActiveMarkets = useCallback(() => {
    return markets.filter((m) => m.status === MarketStatus.Active);
  }, [markets]);

  const getResolvedMarkets = useCallback(() => {
    return markets.filter((m) => m.status === MarketStatus.Resolved);
  }, [markets]);

  return {
    markets,
    loading,
    error,
    fetchMarkets,
    getMarketById,
    getActiveMarkets,
    getResolvedMarkets,
  };
}
