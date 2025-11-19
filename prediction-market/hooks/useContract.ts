'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent } from 'wagmi';
import { parseEther } from 'viem';
import { PREDICTION_MARKET_ABI } from '@/lib/contract-abi';

// Contract address - will be set after deployment
const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`;

// Read hooks
export function useMarketCount() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'marketCount',
  });
}

export function useMarket(marketId: bigint) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'getMarket',
    args: [marketId],
  });
}

export function useMarketOdds(marketId: bigint) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'getOdds',
    args: [marketId],
  });
}

export function useMarketBets(marketId: bigint) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'getMarketBets',
    args: [marketId],
  });
}

export function useUserMarkets(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'getUserMarkets',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

// Write hooks
export function useCreateMarket() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const createMarket = async (question: string, outcomes: string[], duration: number) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: PREDICTION_MARKET_ABI,
      functionName: 'createMarket',
      args: [question, outcomes, BigInt(duration)],
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    createMarket,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

export function usePlaceBet() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const placeBet = async (marketId: bigint, outcomeIndex: number, amount: string) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: PREDICTION_MARKET_ABI,
      functionName: 'placeBet',
      args: [marketId, BigInt(outcomeIndex)],
      value: parseEther(amount),
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    placeBet,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

export function useClaimWinnings() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const claimWinnings = async (marketId: bigint, betIndex: number) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: PREDICTION_MARKET_ABI,
      functionName: 'claimWinnings',
      args: [marketId, BigInt(betIndex)],
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    claimWinnings,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

// Event watching hooks
export function useWatchMarketCreated(onMarketCreated: (log: any) => void) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    eventName: 'MarketCreated',
    onLogs: (logs) => {
      logs.forEach(onMarketCreated);
    },
  });
}

export function useWatchBetPlaced(onBetPlaced: (log: any) => void) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    eventName: 'BetPlaced',
    onLogs: (logs) => {
      logs.forEach(onBetPlaced);
    },
  });
}

export function useWatchOddsUpdated(onOddsUpdated: (log: any) => void) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    eventName: 'OddsUpdated',
    onLogs: (logs) => {
      logs.forEach(onOddsUpdated);
    },
  });
}

export function useWatchMarketResolved(onMarketResolved: (log: any) => void) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    eventName: 'MarketResolved',
    onLogs: (logs) => {
      logs.forEach(onMarketResolved);
    },
  });
}
