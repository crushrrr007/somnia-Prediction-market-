export enum MarketStatus {
  Active = 'Active',
  Closed = 'Closed',
  Resolved = 'Resolved',
  Cancelled = 'Cancelled',
}

export interface Market {
  id: string;
  question: string;
  outcomes: string[];
  endTime: number;
  resolutionTime: number;
  creator: string;
  resolved: boolean;
  winningOutcome: number;
  totalPool: string;
  status: MarketStatus;
  odds: number[];
  volume24h?: string;
  participants?: number;
}

export interface Bet {
  bettor: string;
  marketId: string;
  outcomeIndex: number;
  amount: string;
  timestamp: number;
  claimed: boolean;
  txHash?: string;
}

export interface OddsUpdate {
  marketId: string;
  odds: number[];
  timestamp: number;
}

export interface DataStreamEvent {
  eventId: string;
  marketId: string;
  data: any;
  timestamp: number;
}

export interface UserStats {
  totalBets: number;
  totalWagered: string;
  totalWon: string;
  winRate: number;
  activeBets: number;
}

export interface MarketActivity {
  type: 'bet' | 'market_created' | 'market_resolved';
  marketId: string;
  user?: string;
  amount?: string;
  outcome?: number;
  timestamp: number;
  txHash: string;
}
