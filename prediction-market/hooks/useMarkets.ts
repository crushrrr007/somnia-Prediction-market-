'use client';

import { useState, useEffect, useCallback } from 'react';
import { Market, MarketStatus } from '@/types';
import { useBetStream, useOddsStream, useMarketResolutionStream, useMarketStream } from './useSomniaDataStreams';
import { useMarketCount, useMarket } from './useContract';
import { formatEther } from 'viem';

// Mock data for initial display (will be replaced with real data from contract)
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

/**
 * Hook to manage market data with real-time updates from Somnia Data Streams
 */
export function useMarkets() {
  const [markets, setMarkets] = useState<Market[]>(MOCK_MARKETS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get market count from contract
  const { data: marketCount } = useMarketCount();

  // Real-time event handlers
  const handleNewMarket = useCallback((event: any) => {
    console.log('📢 New market created:', event);

    const newMarket: Market = {
      id: event.marketId,
      question: event.question,
      outcomes: event.outcomes || [],
      endTime: parseInt(event.endTime || '0'),
      resolutionTime: 0,
      creator: event.creator,
      resolved: false,
      winningOutcome: 0,
      totalPool: '0',
      status: MarketStatus.Active,
      odds: event.outcomes?.map(() => 100 / event.outcomes.length) || [],
    };

    setMarkets((prev) => [newMarket, ...prev]);
  }, []);

  const handleBetUpdate = useCallback((event: any) => {
    console.log('📢 Bet placed:', event);

    setMarkets((prev) =>
      prev.map((market) => {
        if (market.id === event.marketId) {
          return {
            ...market,
            totalPool: event.newPoolTotal ? formatEther(BigInt(event.newPoolTotal)) : market.totalPool,
          };
        }
        return market;
      })
    );
  }, []);

  const handleOddsUpdate = useCallback((event: any) => {
    console.log('📢 Odds updated:', event);

    setMarkets((prev) =>
      prev.map((market) => {
        if (market.id === event.marketId) {
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
    console.log('📢 Market resolved:', event);

    setMarkets((prev) =>
      prev.map((market) => {
        if (market.id === event.marketId) {
          return {
            ...market,
            resolved: true,
            winningOutcome: parseInt(event.winningOutcome || '0'),
            status: MarketStatus.Resolved,
            resolutionTime: parseInt(event.timestamp || '0'),
          };
        }
        return market;
      })
    );
  }, []);

  // Subscribe to real-time updates from Somnia Data Streams
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const isContractDeployed = contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000';

  useMarketStream(handleNewMarket, isContractDeployed || false);
  useBetStream(handleBetUpdate, isContractDeployed || false);
  useOddsStream(handleOddsUpdate, isContractDeployed || false);
  useMarketResolutionStream(handleMarketResolution, isContractDeployed || false);

  // Fetch markets from contract when available
  const fetchMarkets = useCallback(async () => {
    if (!marketCount || marketCount === BigInt(0)) {
      // No markets on contract yet, use mock data
      console.log('ℹ️  Using mock data - contract not deployed or no markets created');
      return;
    }

    setLoading(true);
    try {
      // TODO: Fetch all markets from contract
      // For now, keeping mock data until contract is deployed
      console.log(`📊 Found ${marketCount} markets on contract`);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch markets');
    } finally {
      setLoading(false);
    }
  }, [marketCount]);

  useEffect(() => {
    if (isContractDeployed) {
      fetchMarkets();
    }
  }, [fetchMarkets, isContractDeployed]);

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
    isContractDeployed: isContractDeployed || false,
  };
}
