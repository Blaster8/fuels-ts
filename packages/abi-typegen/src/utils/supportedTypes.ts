import { ArrayType } from '../abi/types/ArrayType.js';
import { B256Type } from '../abi/types/B256Type.js';
import { B512Type } from '../abi/types/B512Type.js';
import { BoolType } from '../abi/types/BoolType.js';
import { BytesType } from '../abi/types/BytesType.js';
import { EnumType } from '../abi/types/EnumType.js';
import { EvmAddressType } from '../abi/types/EvmAddressType.js';
import { GenericType } from '../abi/types/GenericType.js';
import { OptionType } from '../abi/types/OptionType.js';
import { RawUntypedPtr } from '../abi/types/RawUntypedPtr.js';
import { RawUntypedSlice } from '../abi/types/RawUntypedSlice.js';
import { StdStringType } from '../abi/types/StdStringType.js';
import { StrSliceType } from '../abi/types/StrSliceType.js';
import { StrType } from '../abi/types/StrType.js';
import { StructType } from '../abi/types/StructType.js';
import { TupleType } from '../abi/types/TupleType.js';
import { U16Type } from '../abi/types/U16Type.js';
import { U256Type } from '../abi/types/U256Type.js';
import { U32Type } from '../abi/types/U32Type.js';
import { U64Type } from '../abi/types/U64Type.js';
import { U8Type } from '../abi/types/U8Type.js';
import { VectorType } from '../abi/types/VectorType.js';

export const supportedTypes = [
  ArrayType,
  B256Type,
  B512Type,
  BoolType,
  BytesType,
  EnumType,
  GenericType,
  OptionType,
  RawUntypedPtr,
  RawUntypedSlice,
  StdStringType,
  StrType,
  StrSliceType,
  StructType,
  TupleType,
  U16Type,
  U32Type,
  U64Type,
  U256Type,
  U8Type,
  VectorType,
  EvmAddressType,
];
