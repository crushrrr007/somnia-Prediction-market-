import { defineChain } from 'viem';

export const somniaTestnet = defineChain({
  id: 50312,
  name: 'Somnia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Somnia Test Token',
    symbol: 'STT',
  },
  rpcUrls: {
    default: {
      http: ['https://dream-rpc.somnia.network'],
    },
    public: {
      http: ['https://dream-rpc.somnia.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Somnia Explorer',
      url: 'https://shannon-explorer.somnia.network',
    },
  },
  testnet: true,
});

export const config = {
  chainId: 50312,
  rpcUrl: process.env.NEXT_PUBLIC_SOMNIA_RPC_URL || 'https://dream-rpc.somnia.network',
  explorerUrl: 'https://shannon-explorer.somnia.network',
};

// Data Streams Schema Definitions
export const SCHEMAS = {
  MARKET_CREATED: {
    id: 'market-created',
    schema: 'uint256 marketId, string question, uint256 endTime, address creator, uint256 timestamp',
  },
  BET_PLACED: {
    id: 'bet-placed',
    schema: 'uint256 marketId, address bettor, uint256 outcomeIndex, uint256 amount, uint256 newPoolTotal, uint256 timestamp',
  },
  ODDS_UPDATED: {
    id: 'odds-updated',
    schema: 'uint256 marketId, uint256[] odds, uint256 timestamp',
  },
  MARKET_RESOLVED: {
    id: 'market-resolved',
    schema: 'uint256 marketId, uint256 winningOutcome, uint256 totalPool, uint256 timestamp',
  },
};

export const MARKET_CATEGORIES = [
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'crypto', name: 'Crypto', icon: '₿' },
  { id: 'politics', name: 'Politics', icon: '🗳️' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'finance', name: 'Finance', icon: '💰' },
  { id: 'other', name: 'Other', icon: '📊' },
];
