import { SDK } from '@somnia-chain/streams';
import { createPublicClient, createWalletClient, http, type Address } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { somniaTestnet, SCHEMAS } from './config';

let sdkInstance: SDK | null = null;
let schemaIds: Record<string, string> = {};

export async function initializeSomniaSDK(privateKey?: `0x${string}`) {
  if (sdkInstance) return sdkInstance;

  const publicClient = createPublicClient({
    chain: somniaTestnet,
    transport: http(),
  });

  let walletClient = null;

  if (privateKey) {
    const account = privateKeyToAccount(privateKey);
    walletClient = createWalletClient({
      chain: somniaTestnet,
      transport: http(),
      account,
    });
  }

  sdkInstance = new SDK({
    public: publicClient,
    wallet: walletClient as any,
  });

  // Register schemas
  await registerSchemas();

  return sdkInstance;
}

export async function registerSchemas() {
  if (!sdkInstance) throw new Error('SDK not initialized');

  try {
    // Register event schemas for real-time subscriptions
    const schemas = Object.values(SCHEMAS);

    for (const schema of schemas) {
      try {
        const schemaId = await sdkInstance.streams.computeSchemaId(schema.schema);
        if (schemaId instanceof Error) {
          throw schemaId;
        }
        schemaIds[schema.id] = schemaId;

        // Check if already registered
        const isRegistered = await sdkInstance.streams.isDataSchemaRegistered(schemaId);

        if (!isRegistered) {
          // Schema registration will be handled by the contract
          console.log(`Schema ${schema.id} needs registration: ${schemaId}`);
        }
      } catch (error) {
        console.warn(`Schema ${schema.id} might already be registered:`, error);
      }
    }
  } catch (error) {
    console.error('Error registering schemas:', error);
  }
}

export function getSchemaId(schemaName: string): string {
  return schemaIds[schemaName] || '';
}

export async function subscribeToMarketCreated(
  callback: (event: any) => void
) {
  // TODO: Implement subscription with proper SubscriptionInitParams
  // This will be configured once the smart contract is deployed
  console.log('Subscribe to market created events');
  return null;
}

export async function subscribeToBetPlaced(
  callback: (event: any) => void
) {
  // TODO: Implement subscription with proper SubscriptionInitParams
  // This will be configured once the smart contract is deployed
  console.log('Subscribe to bet placed events');
  return null;
}

export async function subscribeToOddsUpdated(
  callback: (event: any) => void
) {
  // TODO: Implement subscription with proper SubscriptionInitParams
  // This will be configured once the smart contract is deployed
  console.log('Subscribe to odds updated events');
  return null;
}

export async function subscribeToMarketResolved(
  callback: (event: any) => void
) {
  // TODO: Implement subscription with proper SubscriptionInitParams
  // This will be configured once the smart contract is deployed
  console.log('Subscribe to market resolved events');
  return null;
}

export async function publishMarketData(
  schemaName: string,
  data: any,
  id: string
) {
  // TODO: Implement with proper DataStream params after contract deployment
  console.log('Publish market data:', schemaName, id);
  return null;
}

export async function emitMarketEvent(
  schemaName: string,
  eventData: any
) {
  // TODO: Implement event emission after contract deployment
  console.log('Emit market event:', schemaName);
  return null;
}

export { sdkInstance };
