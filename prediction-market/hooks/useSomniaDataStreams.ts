'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  initializeSomniaSDK,
  subscribeToBetPlaced,
  subscribeToOddsUpdated,
  subscribeToMarketCreated,
  subscribeToMarketResolved,
} from '@/lib/somnia-sdk';

export function useSomniaDataStreams() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeSomniaSDK();
        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize Somnia SDK:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    init();
  }, []);

  return { isInitialized, error };
}

export function useMarketStream(callback: (event: any) => void) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    let subscription: any = null;

    const subscribe = async () => {
      try {
        subscription = await subscribeToMarketCreated(callback);
        setIsSubscribed(true);
      } catch (err) {
        console.error('Failed to subscribe to market created:', err);
      }
    };

    subscribe();

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, [callback]);

  return { isSubscribed };
}

export function useBetStream(callback: (event: any) => void) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    let subscription: any = null;

    const subscribe = async () => {
      try {
        subscription = await subscribeToBetPlaced(callback);
        setIsSubscribed(true);
      } catch (err) {
        console.error('Failed to subscribe to bets:', err);
      }
    };

    subscribe();

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, [callback]);

  return { isSubscribed };
}

export function useOddsStream(callback: (event: any) => void) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    let subscription: any = null;

    const subscribe = async () => {
      try {
        subscription = await subscribeToOddsUpdated(callback);
        setIsSubscribed(true);
      } catch (err) {
        console.error('Failed to subscribe to odds:', err);
      }
    };

    subscribe();

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, [callback]);

  return { isSubscribed };
}

export function useMarketResolutionStream(callback: (event: any) => void) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    let subscription: any = null;

    const subscribe = async () => {
      try {
        subscription = await subscribeToMarketResolved(callback);
        setIsSubscribed(true);
      } catch (err) {
        console.error('Failed to subscribe to market resolutions:', err);
      }
    };

    subscribe();

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, [callback]);

  return { isSubscribed };
}
