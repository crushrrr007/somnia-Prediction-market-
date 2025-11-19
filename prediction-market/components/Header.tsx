'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Wallet, Activity, TrendingUp, Menu, X, Loader2 } from 'lucide-react';
import Button from './ui/Button';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { formatAddress } from '@/utils/format';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    if (isConnected) {
      disconnect();
    } else {
      // Use the first available connector (injected/MetaMask)
      const injectedConnector = connectors.find(c => c.id === 'injected');
      if (injectedConnector) {
        connect({ connector: injectedConnector });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Somnia Predict
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Markets
            </Link>
            <Link
              href="/portfolio"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Portfolio
            </Link>
            <Link
              href="/activity"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              <div className="flex items-center">
                <Activity className="w-4 h-4 mr-1" />
                Activity
              </div>
            </Link>
          </nav>

          {/* Wallet Connection */}
          <div className="hidden md:block">
            <Button
              onClick={handleConnect}
              variant={isConnected ? 'secondary' : 'primary'}
              size="md"
              isLoading={isPending}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : isConnected ? (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  {formatAddress(address || '')}
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </>
              )}
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-3">
            <Link
              href="/"
              className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Markets
            </Link>
            <Link
              href="/portfolio"
              className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Portfolio
            </Link>
            <Link
              href="/activity"
              className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Activity
            </Link>
            <div className="pt-3 border-t border-gray-200">
              <Button
                onClick={handleConnect}
                variant={isConnected ? 'secondary' : 'primary'}
                className="w-full"
                isLoading={isPending}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : isConnected ? (
                  <>
                    <Wallet className="w-4 h-4 mr-2" />
                    {formatAddress(address || '')}
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
