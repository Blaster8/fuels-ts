import type { IRawAbiConfigurable } from './IRawAbiConfigurable.js';
import type { IRawAbiFunction } from './IRawAbiFunction.js';
import type { IRawAbiLoggedTypes } from './IRawAbiLoggedTypes.js';
import type { IRawAbiTypeRoot } from './IRawAbiType.js';

export interface IRawAbi {
  types: IRawAbiTypeRoot[];
  functions: IRawAbiFunction[];
  loggedTypes: IRawAbiLoggedTypes[];
  configurables: IRawAbiConfigurable[];
}
