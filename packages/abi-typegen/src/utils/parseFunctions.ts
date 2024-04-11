import type { IFunction } from '../types/interfaces/IFunction.js';
import type { IRawAbiFunction } from '../types/interfaces/IRawAbiFunction.js';
import type { IType } from '../types/interfaces/IType.js';

import { makeFunction } from './makeFunction.js';

export function parseFunctions(params: { types: IType[]; rawAbiFunctions: IRawAbiFunction[] }) {
  const { types, rawAbiFunctions } = params;
  const functions: IFunction[] = rawAbiFunctions.map((rawAbiFunction) =>
    makeFunction({ types, rawAbiFunction })
  );
  return functions;
}
