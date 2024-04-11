import type { IRawAbiFunction } from './IRawAbiFunction.js';
import type { IType } from './IType.js';

export interface IFunctionAttributes {
  inputs: string;
  output: string;
  prefixedInputs: string;
}

export interface IFunction {
  types: IType[];
  name: string;
  rawAbiFunction: IRawAbiFunction;
  attributes: IFunctionAttributes;
  getDeclaration(): string;
}
