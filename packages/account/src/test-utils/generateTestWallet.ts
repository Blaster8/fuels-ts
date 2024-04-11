import type { Provider, CoinQuantityLike } from '../providers/index.js';
import type { WalletUnlocked } from '../wallet/index.js';
import { Wallet } from '../wallet/index.js';

import { seedTestWallet } from './seedTestWallet.js';

export const generateTestWallet = async (
  provider: Provider,
  quantities?: CoinQuantityLike[]
): Promise<WalletUnlocked> => {
  const wallet = Wallet.generate({ provider });
  if (quantities) {
    await seedTestWallet(wallet, quantities);
  }
  return wallet;
};
