import {
  AbiTypegenProjectsEnum,
  getTypegenForcProject,
} from '../../test/fixtures/forc-projects/index.js';
import { ProgramTypeEnum } from '../types/enums/ProgramTypeEnum.js';

import { collectStorageSlotsFilepaths } from './collectStorageSlotsFilePaths.js';

/**
 * @group node
 */
describe('collectStorageSlotsFilePaths.ts', () => {
  const script = getTypegenForcProject(AbiTypegenProjectsEnum.SCRIPT);
  const predicate = getTypegenForcProject(AbiTypegenProjectsEnum.PREDICATE);
  const contract = getTypegenForcProject(AbiTypegenProjectsEnum.MINIMAL);

  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('should collect storage slot files', () => {
    const contractStorageSlots = collectStorageSlotsFilepaths({
      filepaths: [contract.abiPath],
      programType: ProgramTypeEnum.CONTRACT,
    });

    const predicateStorageSlots = collectStorageSlotsFilepaths({
      filepaths: [predicate.abiPath],
      programType: ProgramTypeEnum.PREDICATE,
    });

    const scriptStorageSlots = collectStorageSlotsFilepaths({
      filepaths: [script.abiPath],
      programType: ProgramTypeEnum.SCRIPT,
    });

    expect(contractStorageSlots.length).toEqual(1);
    expect(predicateStorageSlots.length).toEqual(0);
    expect(scriptStorageSlots.length).toEqual(0);
  });
});
