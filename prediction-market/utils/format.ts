import { formatDistanceToNow, format } from 'date-fns';

export function formatCurrency(amount: string | number, decimals = 4): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0';

  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}K`;
  }
  return num.toFixed(decimals);
}

export function formatTimeRemaining(endTime: number): string {
  const now = Date.now() / 1000;
  const remaining = endTime - now;

  if (remaining <= 0) return 'Ended';

  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function formatDate(timestamp: number): string {
  return format(new Date(timestamp * 1000), 'MMM d, yyyy HH:mm');
}

export function formatRelativeTime(timestamp: number): string {
  return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true });
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function calculateOdds(pool: number, totalPool: number): number {
  if (totalPool === 0) return 0;
  return (pool / totalPool) * 100;
}

export function calculatePayout(betAmount: number, betPool: number, totalPool: number, platformFee = 2): number {
  if (betPool === 0) return 0;
  const platformCut = (totalPool * platformFee) / 100;
  const payoutPool = totalPool - platformCut;
  return (betAmount * payoutPool) / betPool;
}

export function formatOdds(percentage: number): string {
  if (percentage === 0) return 'Even';
  const decimal = 100 / percentage;
  return decimal.toFixed(2);
}
