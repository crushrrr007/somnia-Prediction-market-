import { SDK } from '@somnia-chain/streams';
import { createPublicClient, createWalletClient, http, type Address, decodeEventLog } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { somniaTestnet, SCHEMAS } from './config';
import { PREDICTION_MARKET_ABI } from './contract-abi';

let sdkInstance: SDK | null = null;
let publicClient: any = null;
let eventSubscriptions: Map<string, any> = new Map();

// Contract address - will be set after deployment
const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`;

/**
 * Initialize the Somnia Data Streams SDK
 * This creates both the SDK instance and clients for blockchain interaction
 */
export async function initializeSomniaSDK(privateKey?: `0x${string}`) {
  if (sdkInstance && publicClient) return { sdk: sdkInstance, client: publicClient };

  // Create public client for reading blockchain data
  publicClient = createPublicClient({
    chain: somniaTestnet,
    transport: http(),
  });

  let walletClient = null;

  // Create wallet client if private key provided (for backend/admin operations)
  if (privateKey) {
    const account = privateKeyToAccount(privateKey);
    walletClient = createWalletClient({
      chain: somniaTestnet,
      transport: http(),
      account,
    });
  }

  // Initialize Somnia Data Streams SDK
  sdkInstance = new SDK({
    public: publicClient,
    wallet: walletClient as any,
  });

  console.log('✅ Somnia SDK initialized');

  return { sdk: sdkInstance, client: publicClient };
}

/**
 * Subscribe to MarketCreated events from the contract
 * Uses native blockchain event watching for real-time updates
 */
export function subscribeToMarketCreated(callback: (event: any) => void): () => void {
  if (!publicClient) {
    console.warn('SDK not initialized, initializing now...');
    initializeSomniaSDK();
  }

  // Watch for MarketCreated events on the blockchain
  const unwatch = publicClient.watchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    eventName: 'MarketCreated',
    onLogs: (logs: any[]) => {
      logs.forEach((log) => {
        try {
          const decoded = decodeEventLog({
            abi: PREDICTION_MARKET_ABI,
            data: log.data,
            topics: log.topics,
          });

          const args = decoded.args as any;
          const event = {
            marketId: args.marketId?.toString(),
            question: args.question,
            outcomes: args.outcomes,
            endTime: args.endTime?.toString(),
            creator: args.creator,
            timestamp: args.timestamp?.toString(),
            transactionHash: log.transactionHash,
            blockNumber: log.blockNumber?.toString(),
          };

          console.log('📢 MarketCreated event:', event);
          callback(event);
        } catch (error) {
          console.error('Error decoding MarketCreated event:', error);
        }
      });
    },
  });

  eventSubscriptions.set('MarketCreated', unwatch);

  // Return cleanup function
  return () => {
    unwatch();
    eventSubscriptions.delete('MarketCreated');
  };
}

/**
 * Subscribe to BetPlaced events from the contract
 * Provides real-time updates when bets are placed
 */
export function subscribeToBetPlaced(callback: (event: any) => void): () => void {
  if (!publicClient) {
    console.warn('SDK not initialized, initializing now...');
    initializeSomniaSDK();
  }

  const unwatch = publicClient.watchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    eventName: 'BetPlaced',
    onLogs: (logs: any[]) => {
      logs.forEach((log) => {
        try {
          const decoded = decodeEventLog({
            abi: PREDICTION_MARKET_ABI,
            data: log.data,
            topics: log.topics,
          });

          const args = decoded.args as any;
          const event = {
            marketId: args.marketId?.toString(),
            bettor: args.bettor,
            outcomeIndex: args.outcomeIndex?.toString(),
            amount: args.amount?.toString(),
            newPoolTotal: args.newPoolTotal?.toString(),
            timestamp: args.timestamp?.toString(),
            transactionHash: log.transactionHash,
            blockNumber: log.blockNumber?.toString(),
          };

          console.log('📢 BetPlaced event:', event);
          callback(event);
        } catch (error) {
          console.error('Error decoding BetPlaced event:', error);
        }
      });
    },
  });

  eventSubscriptions.set('BetPlaced', unwatch);

  return () => {
    unwatch();
    eventSubscriptions.delete('BetPlaced');
  };
}

/**
 * Subscribe to OddsUpdated events from the contract
 * Real-time odds changes for live market updates
 */
export function subscribeToOddsUpdated(callback: (event: any) => void): () => void {
  if (!publicClient) {
    console.warn('SDK not initialized, initializing now...');
    initializeSomniaSDK();
  }

  const unwatch = publicClient.watchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    eventName: 'OddsUpdated',
    onLogs: (logs: any[]) => {
      logs.forEach((log) => {
        try {
          const decoded = decodeEventLog({
            abi: PREDICTION_MARKET_ABI,
            data: log.data,
            topics: log.topics,
          });

          const args = decoded.args as any;
          const event = {
            marketId: args.marketId?.toString(),
            odds: args.odds?.map((o: bigint) => Number(o)),
            timestamp: args.timestamp?.toString(),
            transactionHash: log.transactionHash,
            blockNumber: log.blockNumber?.toString(),
          };

          console.log('📢 OddsUpdated event:', event);
          callback(event);
        } catch (error) {
          console.error('Error decoding OddsUpdated event:', error);
        }
      });
    },
  });

  eventSubscriptions.set('OddsUpdated', unwatch);

  return () => {
    unwatch();
    eventSubscriptions.delete('OddsUpdated');
  };
}

/**
 * Subscribe to MarketResolved events from the contract
 * Notifies when markets are settled with winning outcomes
 */
export function subscribeToMarketResolved(callback: (event: any) => void): () => void {
  if (!publicClient) {
    console.warn('SDK not initialized, initializing now...');
    initializeSomniaSDK();
  }

  const unwatch = publicClient.watchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    eventName: 'MarketResolved',
    onLogs: (logs: any[]) => {
      logs.forEach((log) => {
        try {
          const decoded = decodeEventLog({
            abi: PREDICTION_MARKET_ABI,
            data: log.data,
            topics: log.topics,
          });

          const args = decoded.args as any;
          const event = {
            marketId: args.marketId?.toString(),
            winningOutcome: args.winningOutcome?.toString(),
            totalPool: args.totalPool?.toString(),
            timestamp: args.timestamp?.toString(),
            transactionHash: log.transactionHash,
            blockNumber: log.blockNumber?.toString(),
          };

          console.log('📢 MarketResolved event:', event);
          callback(event);
        } catch (error) {
          console.error('Error decoding MarketResolved event:', error);
        }
      });
    },
  });

  eventSubscriptions.set('MarketResolved', unwatch);

  return () => {
    unwatch();
    eventSubscriptions.delete('MarketResolved');
  };
}

/**
 * Cleanup all active subscriptions
 */
export function cleanupSubscriptions() {
  eventSubscriptions.forEach((unwatch, eventName) => {
    console.log(`Cleaning up ${eventName} subscription`);
    unwatch();
  });
  eventSubscriptions.clear();
}

/**
 * Get the current contract address
 */
export function getContractAddress(): Address {
  return CONTRACT_ADDRESS;
}

/**
 * Check if SDK is initialized
 */
export function isSDKInitialized(): boolean {
  return sdkInstance !== null && publicClient !== null;
}

export { sdkInstance, publicClient };
