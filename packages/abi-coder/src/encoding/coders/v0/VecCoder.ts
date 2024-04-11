import { ErrorCode, FuelError } from '@fuel-ts/errors';
import { bn } from '@fuel-ts/math';

import { MAX_BYTES } from '../../../utils/constants.js';
import {
  concatWithDynamicData,
  BASE_VECTOR_OFFSET,
  chunkByLength,
  isUint8Array,
} from '../../../utils/utilities.js';
import type { Uint8ArrayWithDynamicData } from '../../../utils/utilities.js';
import type { TypesOfCoder } from '../AbstractCoder.js';
import { Coder } from '../AbstractCoder.js';

import { BigNumberCoder } from './BigNumberCoder.js';

type InputValueOf<TCoder extends Coder> = Array<TypesOfCoder<TCoder>['Input']>;
type DecodedValueOf<TCoder extends Coder> = Array<TypesOfCoder<TCoder>['Decoded']>;

export class VecCoder<TCoder extends Coder> extends Coder<
  InputValueOf<TCoder>,
  DecodedValueOf<TCoder>
> {
  coder: TCoder;

  constructor(coder: TCoder) {
    super('struct', `struct Vec`, coder.encodedLength + BASE_VECTOR_OFFSET);
    this.coder = coder;
  }

  encode(value: InputValueOf<TCoder>): Uint8Array {
    if (!Array.isArray(value) && !isUint8Array(value)) {
      throw new FuelError(
        ErrorCode.ENCODE_ERROR,
        `Expected array value, or a Uint8Array. You can use arrayify to convert a value to a Uint8Array.`
      );
    }

    const parts: Uint8Array[] = [];

    // pointer (ptr)
    const pointer: Uint8ArrayWithDynamicData = new BigNumberCoder('u64').encode(BASE_VECTOR_OFFSET);
    // pointer dynamicData, encode the vector now and attach to its pointer
    pointer.dynamicData = {
      0: concatWithDynamicData(Array.from(value).map((v) => this.coder.encode(v))),
    };

    parts.push(pointer);

    // capacity (cap)
    parts.push(new BigNumberCoder('u64').encode(value.length));

    // length (len)
    parts.push(new BigNumberCoder('u64').encode(value.length));

    return concatWithDynamicData(parts);
  }

  decode(data: Uint8Array, offset: number): [DecodedValueOf<TCoder>, number] {
    if (data.length < BASE_VECTOR_OFFSET || data.length > MAX_BYTES) {
      throw new FuelError(ErrorCode.DECODE_ERROR, `Invalid vec data size.`);
    }

    const len = data.slice(16, 24);
    const encodedLength = bn(new BigNumberCoder('u64').decode(len, 0)[0]).toNumber();
    const vectorRawDataLength = encodedLength * this.coder.encodedLength;
    const vectorRawData = data.slice(BASE_VECTOR_OFFSET, BASE_VECTOR_OFFSET + vectorRawDataLength);

    if (vectorRawData.length !== vectorRawDataLength) {
      throw new FuelError(ErrorCode.DECODE_ERROR, `Invalid vec byte data size.`);
    }

    return [
      chunkByLength(vectorRawData, this.coder.encodedLength).map(
        (chunk) => this.coder.decode(chunk, 0)[0]
      ),
      offset + BASE_VECTOR_OFFSET,
    ];
  }
}
