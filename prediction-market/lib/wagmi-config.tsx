'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { somniaTestnet } from '@/lib/config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected, walletConnect } from 'wagmi/connectors';
import { ReactNode } from 'react';

// Create wagmi config
export const config = createConfig({
  chains: [somniaTestnet],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
    }),
  ],
  transports: {
    [somniaTestnet.id]: http(),
  },
});

// Create a client
const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
