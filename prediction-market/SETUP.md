# Quick Setup Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or Web3 wallet

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NEXT_PUBLIC_SOMNIA_RPC_URL=https://dream-rpc.somnia.network
NEXT_PUBLIC_CHAIN_ID=50312
PRIVATE_KEY=your_private_key_here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm start
```

## Adding Somnia Testnet to MetaMask

1. Open MetaMask
2. Click Networks > Add Network
3. Enter the following:
   - **Network Name**: Somnia Testnet
   - **RPC URL**: `https://dream-rpc.somnia.network`
   - **Chain ID**: `50312`
   - **Currency Symbol**: `STT`
   - **Block Explorer**: `https://shannon-explorer.somnia.network`

## Getting Test Tokens

Visit the Somnia faucet to get STT test tokens for betting.

## Next Steps

1. **Deploy Smart Contract** - Use the provided `PredictionMarket.sol` contract
2. **Configure Data Streams** - Complete the SDK integration in `lib/somnia-sdk.ts`
3. **Connect Wallet** - Implement wallet connection in `components/Header.tsx`
4. **Test Betting** - Place test bets on Somnia testnet

## Project Structure

```
prediction-market/
├── app/                  # Next.js pages
│   ├── page.tsx         # Home/Markets
│   ├── markets/[id]/    # Market details
│   ├── portfolio/       # User portfolio
│   └── activity/        # Activity feed
├── components/          # React components
├── contracts/           # Smart contracts
├── hooks/              # Custom React hooks
├── lib/                # Core libraries
└── utils/              # Helper functions
```

## Key Features

- **Real-time Market Updates** - Powered by Somnia Data Streams
- **Modern UI** - Clean, professional design
- **Smart Contracts** - Secure, on-chain betting
- **Live Activity** - Real-time platform activity
- **User Portfolio** - Track your bets and performance

## Troubleshooting

### Build Issues

If you encounter build errors:

```bash
rm -rf .next node_modules
npm install
npm run build
```

### Data Streams Connection

The Data Streams integration requires:
1. Deployed smart contract address
2. Registered schemas on Somnia Network
3. Private key with STT balance

Complete the TODOs in `lib/somnia-sdk.ts` after deploying contracts.

### TypeScript Errors

Run type checking:

```bash
npx tsc --noEmit
```

## Support

- Documentation: See README.md
- Deployment: See DEPLOYMENT.md
- Somnia Docs: https://docs.somnia.network

## License

ISC
