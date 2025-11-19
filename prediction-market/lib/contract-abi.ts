export const PREDICTION_MARKET_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "marketId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "bettor", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "payout", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "BetClaimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "marketId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "bettor", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "outcomeIndex", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "newPoolTotal", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "BetPlaced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "marketId", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "question", "type": "string"},
      {"indexed": false, "internalType": "string[]", "name": "outcomes", "type": "string[]"},
      {"indexed": false, "internalType": "uint256", "name": "endTime", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "creator", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "MarketCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "marketId", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "winningOutcome", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "totalPool", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "MarketResolved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "marketId", "type": "uint256"},
      {"indexed": false, "internalType": "uint256[]", "name": "odds", "type": "uint256[]"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "OddsUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_marketId", "type": "uint256"},
      {"internalType": "uint256", "name": "_betIndex", "type": "uint256"}
    ],
    "name": "claimWinnings",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_marketId", "type": "uint256"}
    ],
    "name": "closeMarket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_question", "type": "string"},
      {"internalType": "string[]", "name": "_outcomes", "type": "string[]"},
      {"internalType": "uint256", "name": "_duration", "type": "uint256"}
    ],
    "name": "createMarket",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_marketId", "type": "uint256"}
    ],
    "name": "getMarket",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "id", "type": "uint256"},
          {"internalType": "string", "name": "question", "type": "string"},
          {"internalType": "string[]", "name": "outcomes", "type": "string[]"},
          {"internalType": "uint256", "name": "endTime", "type": "uint256"},
          {"internalType": "uint256", "name": "resolutionTime", "type": "uint256"},
          {"internalType": "address", "name": "creator", "type": "address"},
          {"internalType": "bool", "name": "resolved", "type": "bool"},
          {"internalType": "uint256", "name": "winningOutcome", "type": "uint256"},
          {"internalType": "uint256", "name": "totalPool", "type": "uint256"},
          {"internalType": "enum PredictionMarket.MarketStatus", "name": "status", "type": "uint8"}
        ],
        "internalType": "struct PredictionMarket.Market",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_marketId", "type": "uint256"}
    ],
    "name": "getMarketBets",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "bettor", "type": "address"},
          {"internalType": "uint256", "name": "marketId", "type": "uint256"},
          {"internalType": "uint256", "name": "outcomeIndex", "type": "uint256"},
          {"internalType": "uint256", "name": "amount", "type": "uint256"},
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
          {"internalType": "bool", "name": "claimed", "type": "bool"}
        ],
        "internalType": "struct PredictionMarket.Bet[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_marketId", "type": "uint256"}
    ],
    "name": "getOdds",
    "outputs": [
      {"internalType": "uint256[]", "name": "", "type": "uint256[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_user", "type": "address"}
    ],
    "name": "getUserMarkets",
    "outputs": [
      {"internalType": "uint256[]", "name": "", "type": "uint256[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "marketCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "name": "markets",
    "outputs": [
      {"internalType": "uint256", "name": "id", "type": "uint256"},
      {"internalType": "string", "name": "question", "type": "string"},
      {"internalType": "uint256", "name": "endTime", "type": "uint256"},
      {"internalType": "uint256", "name": "resolutionTime", "type": "uint256"},
      {"internalType": "address", "name": "creator", "type": "address"},
      {"internalType": "bool", "name": "resolved", "type": "bool"},
      {"internalType": "uint256", "name": "winningOutcome", "type": "uint256"},
      {"internalType": "uint256", "name": "totalPool", "type": "uint256"},
      {"internalType": "enum PredictionMarket.MarketStatus", "name": "status", "type": "uint8"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_marketId", "type": "uint256"},
      {"internalType": "uint256", "name": "_outcomeIndex", "type": "uint256"}
    ],
    "name": "placeBet",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "platformFees",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_marketId", "type": "uint256"},
      {"internalType": "uint256", "name": "_winningOutcome", "type": "uint256"}
    ],
    "name": "resolveMarket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawFees",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
] as const;
