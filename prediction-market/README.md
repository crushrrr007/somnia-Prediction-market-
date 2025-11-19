# Somnia Predict - Decentralized Prediction Markets

A modern, real-time prediction market platform built on **Somnia Testnet** with **Somnia Data Streams** for live updates.

## Features

- **Real-time Odds Updates** - Leverages Somnia Data Streams for instant odds calculation without polling
- **Modern UI/UX** - Clean, professional interface designed for optimal user experience
- **Live Activity Feed** - Real-time updates of bets and market activity across the platform
- **Smart Contract Integration** - Secure, decentralized betting with on-chain settlement
- **User Portfolio** - Track your bets, earnings, and performance
- **Multi-outcome Markets** - Support for binary and multi-choice prediction markets
- **Instant Finality** - Sub-second transaction confirmation on Somnia Network

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom components
- **Blockchain**: Somnia Testnet (Chain ID: 50312)
- **Data Streams**: @somnia-chain/streams SDK
- **Web3 Library**: Viem 2.x
- **Smart Contracts**: Solidity 0.8.20

## Architecture

### Smart Contracts
- `PredictionMarket.sol` - Core market creation, betting, and settlement logic
- Platform fee: 2%
- Minimum bet: 0.001 STT

### Data Streams Integration
The platform uses Somnia Data Streams for real-time event subscriptions:

- **Market Created** - Notifies when new markets are created
- **Bet Placed** - Real-time bet notifications with pool updates
- **Odds Updated** - Live odds calculation after each bet
- **Market Resolved** - Settlement notifications with winning outcomes

### Real-time Architecture
```
User Action (Bet) → Smart Contract → Event Emission →
Data Streams → WebSocket → Client Update (< 1 second)
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- MetaMask or compatible Web3 wallet

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd prediction-market
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
NEXT_PUBLIC_SOMNIA_RPC_URL=https://dream-rpc.somnia.network
NEXT_PUBLIC_CHAIN_ID=50312
PRIVATE_KEY=your_private_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
prediction-market/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (markets list)
│   ├── markets/[id]/      # Market detail pages
│   ├── portfolio/         # User portfolio page
│   └── activity/          # Platform activity feed
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── Header.tsx        # Navigation header
│   ├── MarketCard.tsx    # Market display card
│   ├── LiveActivityFeed.tsx  # Real-time activity
│   └── BetPlacementModal.tsx # Betting interface
├── contracts/            # Solidity smart contracts
│   └── PredictionMarket.sol
├── hooks/                # React hooks
│   ├── useSomniaDataStreams.ts  # Data Streams hooks
│   └── useMarkets.ts     # Market data management
├── lib/                  # Core utilities
│   ├── config.ts         # App configuration
│   └── somnia-sdk.ts     # Data Streams SDK wrapper
├── types/                # TypeScript type definitions
├── utils/                # Helper functions
└── README.md
```

## Key Components

### Somnia Data Streams Integration

```typescript
// Initialize SDK
const sdk = await initializeSomniaSDK(privateKey);

// Subscribe to real-time bet events
const subscription = await subscribeToBetPlaced((event) => {
  console.log('New bet:', event);
  // Update UI automatically
});
```

### Market Creation

```typescript
// Create a new prediction market
const marketId = await createMarket(
  "Will Bitcoin reach $100,000 by end of 2025?",
  ["Yes", "No"],
  30 * 24 * 60 * 60 // 30 days
);
```

### Placing Bets

```typescript
// Place a bet on an outcome
await placeBet(
  marketId,
  outcomeIndex,
  { value: parseEther("1.0") }
);
```

## Somnia Network Configuration

**Network Details:**
- Network Name: Somnia Testnet
- RPC URL: https://dream-rpc.somnia.network
- Chain ID: 50312
- Currency Symbol: STT
- Block Explorer: https://shannon-explorer.somnia.network

### Adding to MetaMask

1. Open MetaMask
2. Click network dropdown
3. Select "Add Network"
4. Enter the network details above
5. Save and switch to Somnia Testnet

## Features in Detail

### 1. Real-time Market Updates
- Odds update instantly when bets are placed
- No need for page refresh or manual polling
- Live activity feed shows platform-wide activity

### 2. User Portfolio
- View all active bets
- Track historical performance
- Calculate win rate and profits
- Monitor potential payouts

### 3. Market Discovery
- Search markets by question
- Filter by status (Active, Resolved)
- Sort by volume, participants, or end time

### 4. Betting Interface
- Visual odds display with progress bars
- Potential payout calculator
- Preset bet amounts for convenience
- Real-time fee calculation

## Smart Contract Functions

### Core Functions

- `createMarket(question, outcomes, duration)` - Create new market
- `placeBet(marketId, outcomeIndex)` - Place a bet (payable)
- `resolveMarket(marketId, winningOutcome)` - Resolve market (owner only)
- `claimWinnings(marketId, betIndex)` - Claim winning payouts
- `getOdds(marketId)` - Get current odds for all outcomes

### View Functions

- `getMarket(marketId)` - Get market details
- `getMarketBets(marketId)` - Get all bets for a market
- `getUserMarkets(user)` - Get all markets a user has bet on

## Security Considerations

- Smart contracts use OpenZeppelin patterns
- Platform fee locked at 2%
- No admin functions for settled markets
- All market data is on-chain and verifiable
- Private keys should never be committed to version control

## Development Roadmap

- [x] Core smart contracts
- [x] Somnia Data Streams integration
- [x] Modern UI/UX design
- [x] Real-time updates
- [x] Market creation and betting
- [x] User portfolio
- [ ] Wallet connection (WalletConnect, MetaMask)
- [ ] Smart contract deployment scripts
- [ ] Market categories and filtering
- [ ] Advanced analytics dashboard
- [ ] Social features (comments, sharing)
- [ ] Mobile responsive improvements
- [ ] Mainnet deployment

## Testing

Run the development server and test locally:

```bash
npm run dev
```

For production build:

```bash
npm run build
npm start
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License

## Support

For issues and questions:
- Open an issue on GitHub
- Check Somnia documentation: https://docs.somnia.network
- Join the Somnia community

## Acknowledgments

- Built for Somnia Network
- Powered by Somnia Data Streams
- Inspired by modern prediction market platforms
