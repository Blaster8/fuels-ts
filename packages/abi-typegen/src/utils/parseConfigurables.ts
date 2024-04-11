import type { IConfigurable } from '../types/interfaces/IConfigurable.js';
import type { IRawAbiConfigurable } from '../types/interfaces/IRawAbiConfigurable.js';
import type { IType } from '../types/interfaces/IType.js';

import { makeConfigurable } from './makeConfigurable.js';

export function parseConfigurables(params: {
  types: IType[];
  rawAbiConfigurables: IRawAbiConfigurable[];
}) {
  const { types, rawAbiConfigurables } = params;

  const configurables: IConfigurable[] = rawAbiConfigurables.map((rawAbiConfigurable) =>
    makeConfigurable({ types, rawAbiConfigurable })
  );

  return configurables;
}
