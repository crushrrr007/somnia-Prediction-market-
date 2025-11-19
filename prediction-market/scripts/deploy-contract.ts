import { createWalletClient, http, createPublicClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { somniaTestnet } from '../lib/config';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Deployment script for PredictionMarket contract
 *
 * Usage:
 * 1. Set PRIVATE_KEY in .env file
 * 2. Run: npx ts-node scripts/deploy-contract.ts
 *
 * This will:
 * - Deploy the PredictionMarket contract to Somnia testnet
 * - Save the contract address to .env
 * - Display deployment information
 */

async function main() {
  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey) {
    throw new Error('PRIVATE_KEY not found in environment variables');
  }

  const account = privateKeyToAccount(privateKey as `0x${string}`);

  const publicClient = createPublicClient({
    chain: somniaTestnet,
    transport: http(),
  });

  const walletClient = createWalletClient({
    account,
    chain: somniaTestnet,
    transport: http(),
  });

  console.log('🚀 Deploying PredictionMarket contract...');
  console.log('📍 Network:', somniaTestnet.name);
  console.log('👤 Deployer:', account.address);

  // Read the compiled contract bytecode
  // Note: You'll need to compile the contract first using Foundry or Hardhat
  // For now, this is a placeholder showing the structure

  console.log('\n⚠️  IMPORTANT: Before running this script:');
  console.log('1. Compile your Solidity contract using Foundry:');
  console.log('   forge build');
  console.log('2. Or compile using Hardhat:');
  console.log('   npx hardhat compile');
  console.log('\n3. The bytecode will be extracted from the compiled artifacts');
  console.log('4. Update this script with the actual bytecode');

  // Example deployment (commented out until bytecode is available)
  /*
  const hash = await walletClient.deployContract({
    abi: PREDICTION_MARKET_ABI,
    bytecode: '0x...',  // Add your compiled bytecode here
    account,
  });

  console.log('📤 Transaction sent:', hash);
  console.log('⏳ Waiting for confirmation...');

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  console.log('✅ Contract deployed!');
  console.log('📝 Contract address:', receipt.contractAddress);
  console.log('🔗 Transaction hash:', receipt.transactionHash);
  console.log('⛽ Gas used:', receipt.gasUsed.toString());

  // Update .env file
  const envPath = path.join(__dirname, '..', '.env');
  let envContent = '';

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Update or add contract address
  if (envContent.includes('NEXT_PUBLIC_CONTRACT_ADDRESS=')) {
    envContent = envContent.replace(
      /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
      `NEXT_PUBLIC_CONTRACT_ADDRESS=${receipt.contractAddress}`
    );
  } else {
    envContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${receipt.contractAddress}\n`;
  }

  fs.writeFileSync(envPath, envContent);

  console.log('\n✅ Contract address saved to .env file');
  console.log(`\n🎉 Deployment complete!`);
  console.log(`\n📋 Next steps:`);
  console.log(`1. Restart your dev server to pick up the new contract address`);
  console.log(`2. The contract is now ready to use on Somnia testnet`);
  console.log(`3. View on explorer: ${somniaTestnet.blockExplorers.default.url}/address/${receipt.contractAddress}`);
  */
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
