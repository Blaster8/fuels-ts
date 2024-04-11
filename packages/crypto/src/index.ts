import cryptoApi from './node/index.js';

export * from './types.js';

export const {
  bufferFromString,
  decrypt,
  encrypt,
  keyFromPassword,
  randomBytes,
  stringFromBuffer,
  scrypt,
  keccak256,
  decryptJsonWalletData,
  encryptJsonWalletData,
} = cryptoApi;
