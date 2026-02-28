import { paymentMiddleware } from 'x402-next';

// Your Base wallet address - receives USDC payments directly
const SELLER_WALLET = process.env.SELLER_WALLET_ADDRESS || '0x0000000000000000000000000000000000000000';

export const middleware = paymentMiddleware(
  SELLER_WALLET,
  {
    // x402 paid route - $0.05 per sentiment call
    '/api/sentiment-x402': {
      price: '$0.05',
      network: 'base',
      config: {
        description: 'SignalGate: Real-time crypto sentiment for BTC, ETH, SOL',
        mimeType: 'application/json',
      },
    },
  },
);

export const config = {
  matcher: ['/api/sentiment-x402/:path*'],
};