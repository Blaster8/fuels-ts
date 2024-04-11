import type { IRawAbiTypeRoot } from '../types/interfaces/IRawAbiType.js';
import type { IType } from '../types/interfaces/IType.js';

import { makeType } from './makeType.js';
import { shouldSkipAbiType } from './shouldSkipAbiType.js';

export function parseTypes(params: { rawAbiTypes: IRawAbiTypeRoot[] }) {
  const types: IType[] = [];

  // First we parse all ROOT nodes
  params.rawAbiTypes.forEach((rawAbiType) => {
    const { type } = rawAbiType;
    const skip = shouldSkipAbiType({ type });
    if (!skip) {
      const parsedType = makeType({ rawAbiType });
      types.push(parsedType);
    }
  });

  // Then we parse all their components' [attributes]
  types.forEach((type) => {
    type.parseComponentsAttributes({ types });
  });

  return types;
}
