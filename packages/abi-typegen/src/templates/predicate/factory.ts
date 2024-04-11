import { ErrorCode, FuelError } from '@fuel-ts/errors';

import type { Abi } from '../../abi/Abi.js';
import { renderHbsTemplate } from '../renderHbsTemplate.js';
import { formatConfigurables } from '../utils/formatConfigurables.js';
import { formatEnums } from '../utils/formatEnums.js';
import { formatImports } from '../utils/formatImports.js';
import { formatStructs } from '../utils/formatStructs.js';

import factoryTemplate from './factory.hbs';

export function renderFactoryTemplate(params: { abi: Abi }) {
  const { abi } = params;

  const { types, configurables } = abi;

  const {
    rawContents,
    name: capitalizedName,
    hexlifiedBinContents: hexlifiedBinString,
  } = params.abi;

  const abiJsonString = JSON.stringify(rawContents, null, 2);

  const func = abi.functions.find((f) => f.name === 'main');

  if (!func) {
    throw new FuelError(ErrorCode.ABI_MAIN_METHOD_MISSING, `ABI doesn't have a 'main()' method.`);
  }

  const { enums } = formatEnums({ types });
  const { structs } = formatStructs({ types });
  const { imports } = formatImports({
    types,
    baseMembers: ['Predicate', 'Provider', 'InputValue'],
  });
  const { formattedConfigurables } = formatConfigurables({ configurables });

  const { prefixedInputs: inputs, output } = func.attributes;

  const text = renderHbsTemplate({
    template: factoryTemplate,
    data: {
      inputs,
      output,
      structs,
      enums,
      abiJsonString,
      hexlifiedBinString,
      capitalizedName,
      imports,
      formattedConfigurables,
    },
  });

  return text;
}
