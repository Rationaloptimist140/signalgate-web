import { paymentMiddleware } from 'x402-next';

// Your Base wallet address - receives USDC payments directly
const SELLER_WALLET = '0x65F204B928a32806FCb364cB8d36B49b647c9f30';

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