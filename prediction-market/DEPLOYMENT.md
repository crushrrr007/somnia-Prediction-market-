# Deployment Guide

This guide will help you deploy the Somnia Predict platform to production.

## Prerequisites

1. **Somnia Testnet Wallet**
   - Get STT tokens from the faucet
   - Have enough balance for contract deployment and Data Streams registration

2. **Node.js Environment**
   - Node.js 18 or higher
   - npm or yarn package manager

3. **Environment Variables**
   - Configure all required environment variables

## Step 1: Smart Contract Deployment

### Using Foundry (Recommended)

1. Install Foundry:
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. Deploy the contract:
```bash
forge create contracts/PredictionMarket.sol:PredictionMarket \
  --rpc-url https://dream-rpc.somnia.network \
  --private-key $PRIVATE_KEY
```

3. Save the deployed contract address.

### Using Hardhat (Alternative)

1. Install Hardhat:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

2. Create `hardhat.config.ts`:
```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    somniaTestnet: {
      url: "https://dream-rpc.somnia.network",
      chainId: 50312,
      accounts: [process.env.PRIVATE_KEY!]
    }
  }
};

export default config;
```

3. Create deployment script in `scripts/deploy.ts`

4. Deploy:
```bash
npx hardhat run scripts/deploy.ts --network somniaTestnet
```

## Step 2: Data Streams Schema Registration

The schemas will be automatically registered when you initialize the SDK. However, you can also register them manually:

```bash
# Run the schema registration script
node scripts/register-schemas.js
```

## Step 3: Environment Configuration

Create a `.env` file in the project root:

```env
# Somnia Network
NEXT_PUBLIC_SOMNIA_RPC_URL=https://dream-rpc.somnia.network
NEXT_PUBLIC_CHAIN_ID=50312

# Contract Addresses
NEXT_PUBLIC_MARKET_REGISTRY_ADDRESS=0x... # Your deployed contract address

# Private Key (for backend operations)
PRIVATE_KEY=0x... # Your wallet private key (NEVER commit this!)

# Optional: Analytics, monitoring, etc.
NEXT_PUBLIC_ANALYTICS_ID=
```

## Step 4: Build and Test

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Test locally:
```bash
npm start
```

4. Verify all features work:
   - Market listing
   - Real-time updates
   - Bet placement (testnet)
   - Portfolio tracking

## Step 5: Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Set environment variables in Vercel dashboard:
   - Go to project settings
   - Navigate to Environment Variables
   - Add all variables from `.env`

5. Redeploy with environment variables:
```bash
vercel --prod
```

## Step 6: Deploy to Other Platforms

### Netlify

1. Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

2. Deploy via Netlify CLI or GitHub integration

### AWS Amplify

1. Connect your GitHub repository
2. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `.next`
3. Add environment variables
4. Deploy

### Self-hosted (Docker)

1. Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

2. Build and run:
```bash
docker build -t somnia-predict .
docker run -p 3000:3000 --env-file .env somnia-predict
```

## Post-Deployment Checklist

- [ ] Smart contract deployed and verified
- [ ] Data Streams schemas registered
- [ ] Environment variables configured
- [ ] Application builds successfully
- [ ] Real-time updates working
- [ ] Wallet connection functional
- [ ] Transactions executing on testnet
- [ ] Analytics/monitoring set up
- [ ] Custom domain configured (if applicable)
- [ ] SSL/TLS certificate active
- [ ] Error logging configured
- [ ] Backup strategy in place

## Monitoring

### Application Monitoring

Use services like:
- Vercel Analytics (built-in)
- Google Analytics
- Sentry for error tracking
- LogRocket for session replay

### Smart Contract Monitoring

- Monitor contract events using Somnia explorer
- Set up alerts for critical events
- Track gas usage and optimization opportunities

### Data Streams Monitoring

- Monitor subscription health
- Track real-time update latency
- Log any connection issues

## Maintenance

### Regular Tasks

1. **Update Dependencies**
```bash
npm update
npm audit fix
```

2. **Monitor Performance**
   - Check Web Vitals
   - Optimize bundle size
   - Review database queries (if added)

3. **Backup Data**
   - Export critical market data
   - Backup configuration
   - Document any custom modifications

### Troubleshooting

**Issue: Data Streams not connecting**
- Check RPC endpoint availability
- Verify schema IDs are correct
- Ensure wallet has sufficient balance

**Issue: Transactions failing**
- Check gas price settings
- Verify contract address
- Ensure sufficient STT balance

**Issue: Build failing**
- Clear `.next` directory
- Delete `node_modules` and reinstall
- Check for TypeScript errors

## Security Best Practices

1. **Never commit private keys**
   - Use environment variables
   - Add `.env` to `.gitignore`
   - Use secret management services in production

2. **Regular Security Audits**
   - Smart contract audits
   - Dependency vulnerability scans
   - Code review processes

3. **Access Control**
   - Limit admin functions
   - Use multi-sig for critical operations
   - Implement rate limiting

4. **Monitoring**
   - Set up anomaly detection
   - Monitor for suspicious activity
   - Log all critical events

## Scaling Considerations

### Frontend Scaling

- Use CDN for static assets
- Implement caching strategies
- Consider Edge runtime for API routes

### Backend Scaling

- Load balance WebSocket connections
- Cache frequent queries
- Use Redis for session management

### Database (if added later)

- Use connection pooling
- Implement read replicas
- Regular performance optimization

## Support

For deployment issues:
1. Check the troubleshooting section
2. Review Somnia documentation
3. Contact support channels
4. Open a GitHub issue

## License

ISC License - See LICENSE file for details
