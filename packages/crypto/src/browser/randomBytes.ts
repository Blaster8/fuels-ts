import type { CryptoApi } from '../types.js';

import { crypto } from './crypto.js';

export const randomBytes: CryptoApi['randomBytes'] = (length: number): Uint8Array => {
  const randomValues = crypto.getRandomValues(new Uint8Array(length));
  return randomValues;
};
