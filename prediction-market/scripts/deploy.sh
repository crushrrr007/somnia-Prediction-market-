#!/bin/bash

# Deployment script for PredictionMarket contract using Foundry
# Make sure you have Foundry installed: https://book.getfoundry.sh/getting-started/installation

set -e

echo "🚀 Deploying PredictionMarket to Somnia Testnet..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "Please create a .env file with your PRIVATE_KEY"
    exit 1
fi

# Source environment variables
source .env

# Check if private key is set
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: PRIVATE_KEY not set in .env"
    exit 1
fi

# Deploy contract using Foundry
echo "📤 Deploying contract..."

forge create contracts/PredictionMarket.sol:PredictionMarket \
    --rpc-url ${NEXT_PUBLIC_SOMNIA_RPC_URL} \
    --private-key ${PRIVATE_KEY} \
    --legacy \
    | tee deploy.log

# Extract contract address from deployment log
CONTRACT_ADDRESS=$(grep "Deployed to:" deploy.log | awk '{print $3}')

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo "❌ Error: Failed to extract contract address"
    exit 1
fi

echo ""
echo "✅ Contract deployed successfully!"
echo "📝 Contract address: $CONTRACT_ADDRESS"
echo ""

# Update .env file with contract address
if grep -q "NEXT_PUBLIC_CONTRACT_ADDRESS=" .env; then
    # Replace existing
    sed -i.bak "s/NEXT_PUBLIC_CONTRACT_ADDRESS=.*/NEXT_PUBLIC_CONTRACT_ADDRESS=$CONTRACT_ADDRESS/" .env
else
    # Add new
    echo "NEXT_PUBLIC_CONTRACT_ADDRESS=$CONTRACT_ADDRESS" >> .env
fi

echo "✅ Contract address saved to .env"
echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Restart your dev server: npm run dev"
echo "2. Connect your wallet to Somnia testnet"
echo "3. Start creating markets and placing bets!"
echo ""
echo "🔗 View on explorer:"
echo "https://shannon-explorer.somnia.network/address/$CONTRACT_ADDRESS"

# Clean up
rm deploy.log.bak 2>/dev/null || true
