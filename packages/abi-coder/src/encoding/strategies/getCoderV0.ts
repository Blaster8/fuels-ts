import { ErrorCode, FuelError } from '@fuel-ts/errors';

import { ResolvedAbiType } from '../../ResolvedAbiType.js';
import type { EncodingOptions } from '../../types/EncodingOptions.js';
import type { GetCoderFn } from '../../types/GetCoder.js';
import {
  B256_CODER_TYPE,
  B512_CODER_TYPE,
  BOOL_CODER_TYPE,
  BYTES_CODER_TYPE,
  ENCODING_V0,
  OPTION_CODER_TYPE,
  RAW_PTR_CODER_TYPE,
  RAW_SLICE_CODER_TYPE,
  STD_STRING_CODER_TYPE,
  STR_SLICE_CODER_TYPE,
  U16_CODER_TYPE,
  U256_CODER_TYPE,
  U32_CODER_TYPE,
  U64_CODER_TYPE,
  U8_CODER_TYPE,
  VEC_CODER_TYPE,
  arrayRegEx,
  enumRegEx,
  stringRegEx,
  structRegEx,
  tupleRegEx,
} from '../../utils/constants.js';
import { findVectorBufferArgument } from '../../utils/json-abi.js';
import type { Coder } from '../coders/AbstractCoder.js';
import { ArrayCoder } from '../coders/v0/ArrayCoder.js';
import { B256Coder } from '../coders/v0/B256Coder.js';
import { B512Coder } from '../coders/v0/B512Coder.js';
import { BigNumberCoder } from '../coders/v0/BigNumberCoder.js';
import { BooleanCoder } from '../coders/v0/BooleanCoder.js';
import { ByteCoder } from '../coders/v0/ByteCoder.js';
import { EnumCoder } from '../coders/v0/EnumCoder.js';
import { NumberCoder } from '../coders/v0/NumberCoder.js';
import { OptionCoder } from '../coders/v0/OptionCoder.js';
import { RawSliceCoder } from '../coders/v0/RawSliceCoder.js';
import { StdStringCoder } from '../coders/v0/StdStringCoder.js';
import { StringCoder } from '../coders/v0/StringCoder.js';
import { StructCoder } from '../coders/v0/StructCoder.js';
import { TupleCoder } from '../coders/v0/TupleCoder.js';
import { VecCoder } from '../coders/v0/VecCoder.js';

import { getCoders } from './getCoders.js';

/**
 * Retrieves coders that adhere to the v0 spec.
 *
 * @param resolvedAbiType - the resolved type to return a coder for.
 * @param options - options to be utilized during the encoding process.
 * @returns the coder for a given type.
 */
export const getCoder: GetCoderFn = (
  resolvedAbiType: ResolvedAbiType,
  options?: EncodingOptions
): Coder => {
  switch (resolvedAbiType.type) {
    case U8_CODER_TYPE:
    case U16_CODER_TYPE:
    case U32_CODER_TYPE:
      return new NumberCoder(resolvedAbiType.type, options);
    case U64_CODER_TYPE:
    case RAW_PTR_CODER_TYPE:
      return new BigNumberCoder('u64');
    case U256_CODER_TYPE:
      return new BigNumberCoder('u256');
    case RAW_SLICE_CODER_TYPE:
      return new RawSliceCoder();
    case BOOL_CODER_TYPE:
      return new BooleanCoder(options);
    case B256_CODER_TYPE:
      return new B256Coder();
    case B512_CODER_TYPE:
      return new B512Coder();
    case BYTES_CODER_TYPE:
      return new ByteCoder();
    case STD_STRING_CODER_TYPE:
      return new StdStringCoder();
    default:
      break;
  }

  const stringMatch = stringRegEx.exec(resolvedAbiType.type)?.groups;
  if (stringMatch) {
    const length = parseInt(stringMatch.length, 10);

    return new StringCoder(length);
  }

  // ABI types underneath MUST have components by definition

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const components = resolvedAbiType.components!;

  const arrayMatch = arrayRegEx.exec(resolvedAbiType.type)?.groups;
  if (arrayMatch) {
    const length = parseInt(arrayMatch.length, 10);
    const arg = components[0];
    if (!arg) {
      throw new FuelError(
        ErrorCode.INVALID_COMPONENT,
        `The provided Array type is missing an item of 'component'.`
      );
    }

    const arrayElementCoder = getCoder(arg, { isSmallBytes: true });
    return new ArrayCoder(arrayElementCoder as Coder, length);
  }

  if (resolvedAbiType.type === VEC_CODER_TYPE) {
    const arg = findVectorBufferArgument(components);
    const argType = new ResolvedAbiType(resolvedAbiType.abi, arg);

    const itemCoder = getCoder(argType, { isSmallBytes: true, encoding: ENCODING_V0 });
    return new VecCoder(itemCoder as Coder);
  }

  const structMatch = structRegEx.exec(resolvedAbiType.type)?.groups;
  if (structMatch) {
    const coders = getCoders(components, { isRightPadded: true, getCoder });
    return new StructCoder(structMatch.name, coders);
  }

  const enumMatch = enumRegEx.exec(resolvedAbiType.type)?.groups;
  if (enumMatch) {
    const coders = getCoders(components, { getCoder });

    const isOptionEnum = resolvedAbiType.type === OPTION_CODER_TYPE;
    if (isOptionEnum) {
      return new OptionCoder(enumMatch.name, coders);
    }
    return new EnumCoder(enumMatch.name, coders);
  }

  const tupleMatch = tupleRegEx.exec(resolvedAbiType.type)?.groups;
  if (tupleMatch) {
    const coders = components.map((component) =>
      getCoder(component, { isRightPadded: true, encoding: ENCODING_V0 })
    );
    return new TupleCoder(coders as Coder[]);
  }

  if (resolvedAbiType.type === STR_SLICE_CODER_TYPE) {
    throw new FuelError(
      ErrorCode.INVALID_DATA,
      'String slices can not be decoded from logs. Convert the slice to `str[N]` with `__to_str_array`'
    );
  }

  throw new FuelError(
    ErrorCode.CODER_NOT_FOUND,
    `Coder not found: ${JSON.stringify(resolvedAbiType)}.`
  );
};
