import { ResolvedAbiType } from './ResolvedAbiType.js';
import type { DecodedValue, InputValue, Coder } from './encoding/coders/AbstractCoder.js';
import { getCoderForEncoding } from './encoding/strategies/getCoderForEncoding.js';
import type { EncodingOptions } from './types/EncodingOptions.js';
import type { JsonAbi, JsonAbiArgument } from './types/JsonAbi.js';

export abstract class AbiCoder {
  static getCoder(
    abi: JsonAbi,
    argument: JsonAbiArgument,
    options: EncodingOptions = {
      isSmallBytes: false,
    }
  ): Coder {
    const resolvedAbiType = new ResolvedAbiType(abi, argument);
    return getCoderForEncoding(options.encoding)(resolvedAbiType, options);
  }

  static encode(
    abi: JsonAbi,
    argument: JsonAbiArgument,
    value: InputValue,
    options?: EncodingOptions
  ) {
    return this.getCoder(abi, argument, options).encode(value);
  }

  static decode(
    abi: JsonAbi,
    argument: JsonAbiArgument,
    data: Uint8Array,
    offset: number,
    options?: EncodingOptions
  ): [DecodedValue | undefined, number] {
    return this.getCoder(abi, argument, options).decode(data, offset) as [
      DecodedValue | undefined,
      number,
    ];
  }
}
