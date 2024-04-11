import type { ResolvedAbiType } from '../ResolvedAbiType.js';
import type { Coder } from '../encoding/coders/AbstractCoder.js';

import type { EncodingOptions } from './EncodingOptions.js';

/**
 * A function that can be used to obtain spec adhering coders.
 *
 * @param resolvedAbiType - the resolved type to return a coder for.
 * @param options - options to be utilized during the encoding process.
 */
export type GetCoderFn = (resolvedAbiType: ResolvedAbiType, options?: EncodingOptions) => Coder;
