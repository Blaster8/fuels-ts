import { fuelsConfig } from '../../../../test/fixtures/fuels.config.js';
import { mockLogger } from '../../../../test/utils/mockLogger.js';

import * as buildSwayProgramMod from './buildSwayProgram.js';
import { buildSwayPrograms } from './buildSwayPrograms.js';

/**
 * @group node
 */
describe('buildSwayPrograms', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockLogger();
  });

  function mockBuildSwayProgram() {
    const buildSwayProgram = vi
      .spyOn(buildSwayProgramMod, 'buildSwayProgram')
      .mockReturnValue(Promise.resolve());

    return {
      buildSwayProgram,
    };
  }

  test('building Sway programs using workspace', async () => {
    const { buildSwayProgram } = mockBuildSwayProgram();

    const config = {
      ...structuredClone(fuelsConfig),
      workspace: '/any/workspace/path',
    };

    await buildSwayPrograms(config);

    expect(buildSwayProgram).toHaveBeenCalledTimes(1);
    expect(buildSwayProgram).toHaveBeenCalledWith(config, config.workspace);
  });

  test('building Sway programs using individual configs', async () => {
    const { buildSwayProgram } = mockBuildSwayProgram();

    await buildSwayPrograms(fuelsConfig);

    expect(buildSwayProgram).toHaveBeenCalledTimes(4);
    expect(buildSwayProgram).toHaveBeenCalledWith(fuelsConfig, fuelsConfig.contracts[0]);
    expect(buildSwayProgram).toHaveBeenCalledWith(fuelsConfig, fuelsConfig.contracts[1]);
    expect(buildSwayProgram).toHaveBeenCalledWith(fuelsConfig, fuelsConfig.scripts[0]);
    expect(buildSwayProgram).toHaveBeenCalledWith(fuelsConfig, fuelsConfig.predicates[0]);
  });
});
