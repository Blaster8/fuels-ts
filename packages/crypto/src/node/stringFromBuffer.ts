import type { CryptoApi, Encoding } from '../types.js';

export const stringFromBuffer: CryptoApi['stringFromBuffer'] = (
  buffer: Uint8Array,
  encoding: Encoding = 'base64'
): string => Buffer.from(buffer).toString(encoding);
