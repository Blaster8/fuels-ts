import { scrypt, keccak256 } from '../shared/index.js';
import type { CryptoApi } from '../types.js';

import { decrypt, encrypt, keyFromPassword } from './aes-ctr.js';
import { bufferFromString } from './bufferFromString.js';
import { decryptJsonWalletData, encryptJsonWalletData } from './encryptJsonWalletData.js';
import { randomBytes } from './randomBytes.js';
import { stringFromBuffer } from './stringFromBuffer.js';

const api: CryptoApi = {
  bufferFromString,
  stringFromBuffer,
  decrypt,
  encrypt,
  keyFromPassword,
  randomBytes,
  scrypt,
  keccak256,
  decryptJsonWalletData,
  encryptJsonWalletData,
};

export default api;
