import {
  AbiTypegenProjectsEnum,
  getTypegenForcProject,
} from '../../../test/fixtures/forc-projects/index.js';
import type { IRawAbiTypeRoot } from '../../index.js';
import { findType } from '../../utils/findType.js';
import { makeType } from '../../utils/makeType.js';
import * as parseTypeArgumentsMod from '../../utils/parseTypeArguments.js';

import { EvmAddressType } from './EvmAddressType.js';
import { StructType } from './StructType.js';
import { VectorType } from './VectorType.js';

/**
 * @group node
 */
describe('EvmAddressType.ts', () => {
  test('should properly parse type attributes', () => {
    const parseTypeArguments = vi.spyOn(parseTypeArgumentsMod, 'parseTypeArguments');

    const project = getTypegenForcProject(AbiTypegenProjectsEnum.EVM_ADDRESS);

    const rawTypes = project.abiContents.types;
    const types = rawTypes.map((rawAbiType: IRawAbiTypeRoot) => makeType({ rawAbiType }));

    const suitableForEvmAddress = EvmAddressType.isSuitableFor({ type: EvmAddressType.swayType });
    const suitableForStruct = EvmAddressType.isSuitableFor({ type: StructType.swayType });
    const suitableForVector = EvmAddressType.isSuitableFor({ type: VectorType.swayType });

    expect(suitableForEvmAddress).toEqual(true);
    expect(suitableForStruct).toEqual(false);
    expect(suitableForVector).toEqual(false);

    parseTypeArguments.mockClear();

    const evmAddress = findType({ types, typeId: 1 }) as EvmAddressType;

    expect(evmAddress.attributes.inputLabel).toEqual('EvmAddress');
    expect(evmAddress.attributes.outputLabel).toEqual('EvmAddress');
    expect(evmAddress.requiredFuelsMembersImports).toStrictEqual(['EvmAddress']);
  });
});
