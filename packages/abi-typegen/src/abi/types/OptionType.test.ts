import {
  AbiTypegenProjectsEnum,
  getTypegenForcProject,
} from '../../../test/fixtures/forc-projects/index.js';
import type { IRawAbiTypeRoot } from '../../index.js';
import { findType } from '../../utils/findType.js';
import { makeType } from '../../utils/makeType.js';

import { EnumType } from './EnumType.js';
import { OptionType } from './OptionType.js';

/**
 * @group node
 */
describe('OptionType.ts', () => {
  /*
    Test helpers
  */
  function getTypesForContract() {
    const project = getTypegenForcProject(AbiTypegenProjectsEnum.OPTION_SIMPLE);
    const rawTypes = project.abiContents.types;

    const types = rawTypes
      .filter((t) => t.type !== '()')
      .map((rawAbiType: IRawAbiTypeRoot) => makeType({ rawAbiType }));

    return { types };
  }

  test('should properly evaluate type suitability', () => {
    const suitableForOption = OptionType.isSuitableFor({ type: OptionType.swayType });
    const suitableForEnum = OptionType.isSuitableFor({ type: EnumType.swayType });

    expect(suitableForOption).toEqual(true);
    expect(suitableForEnum).toEqual(false);
  });

  test('should properly parse type attributes: simple', () => {
    const { types } = getTypesForContract();

    // validating option
    const b = findType({ types, typeId: 1 }) as OptionType;

    expect(b.attributes.inputLabel).toEqual('Option');
    expect(b.attributes.outputLabel).toEqual('Option');
    expect(b.requiredFuelsMembersImports).toStrictEqual([]);
  });
});
