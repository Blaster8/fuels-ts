import type { IRawAbiConfigurable } from './IRawAbiConfigurable.js';
import type { IType } from './IType.js';

export interface IConfigurable {
  name: string;
  type: IType;
  rawAbiConfigurable: IRawAbiConfigurable;
}
