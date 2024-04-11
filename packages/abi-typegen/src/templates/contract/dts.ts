import type { Abi } from '../../abi/Abi.js';
import { renderHbsTemplate } from '../renderHbsTemplate.js';
import { formatConfigurables } from '../utils/formatConfigurables.js';
import { formatEnums } from '../utils/formatEnums.js';
import { formatImports } from '../utils/formatImports.js';
import { formatStructs } from '../utils/formatStructs.js';

import dtsTemplate from './dts.hbs';

export function renderDtsTemplate(params: { abi: Abi }) {
  const { name: capitalizedName, types, functions, commonTypesInUse, configurables } = params.abi;

  /*
    First we format all attributes
  */
  const functionsTypedefs = functions.map((f) => f.getDeclaration());

  const functionsFragments = functions.map((f) => f.name);

  const encoders = functions.map((f) => ({
    functionName: f.name,
    input: f.attributes.inputs,
  }));

  const decoders = functions.map((f) => ({
    functionName: f.name,
  }));

  const { enums } = formatEnums({ types });
  const { structs } = formatStructs({ types });
  const { imports } = formatImports({
    types,
    baseMembers: [
      'Interface',
      'FunctionFragment',
      'DecodedValue',
      'Contract',
      'BytesLike',
      'InvokeFunction',
    ],
  });
  const { formattedConfigurables } = formatConfigurables({ configurables });

  /*
    And finally render template
  */
  const text = renderHbsTemplate({
    template: dtsTemplate,
    data: {
      capitalizedName,
      commonTypesInUse: commonTypesInUse.join(', '),
      functionsTypedefs,
      functionsFragments,
      encoders,
      decoders,
      structs,
      enums,
      imports,
      formattedConfigurables,
    },
  });

  return text;
}
