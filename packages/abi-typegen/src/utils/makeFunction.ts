import { Function } from '../abi/functions/Function.js';
import type { IRawAbiFunction } from '../types/interfaces/IRawAbiFunction.js';
import type { IType } from '../types/interfaces/IType.js';

export function makeFunction(params: { types: IType[]; rawAbiFunction: IRawAbiFunction }) {
  const { types, rawAbiFunction } = params;
  return new Function({ types, rawAbiFunction });
}
