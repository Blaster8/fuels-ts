import { Configurable } from '../abi/configurable/Configurable.js';
import type { IRawAbiConfigurable } from '../types/interfaces/IRawAbiConfigurable.js';
import type { IType } from '../types/interfaces/IType.js';

export function makeConfigurable(params: {
  types: IType[];
  rawAbiConfigurable: IRawAbiConfigurable;
}) {
  const { types, rawAbiConfigurable } = params;
  return new Configurable({ types, rawAbiConfigurable });
}
