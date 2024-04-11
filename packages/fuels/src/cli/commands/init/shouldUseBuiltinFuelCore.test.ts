import * as getSystemForcMod from '@fuel-ts/versions/cli';

import { mockLogger } from '../../../../test/utils/mockLogger.js';

import { shouldUseBuiltinForc } from './shouldUseBuiltinForc.js';

/**
 * @group node
 */
describe('shouldUseBuiltinForc', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  function mockAll(returns: { getSystemForc: string | null }) {
    const getSystemForc = vi
      .spyOn(getSystemForcMod, 'getSystemForc')
      .mockReturnValue({ error: null, systemForcVersion: returns.getSystemForc });

    const { error } = mockLogger();

    return {
      getSystemForc,
      error,
    };
  }

  it('should select [built-in] forc', () => {
    const { getSystemForc, error } = mockAll({ getSystemForc: null });

    const useBuiltinForc = shouldUseBuiltinForc();

    expect(useBuiltinForc).toEqual(true);
    expect(getSystemForc).toHaveBeenCalledTimes(1);

    expect(error).toHaveBeenCalledTimes(0);
  });

  it('should select [system] forc', () => {
    const { getSystemForc, error } = mockAll({ getSystemForc: '1.0.0' });

    const useBuiltinForc = shouldUseBuiltinForc();

    expect(useBuiltinForc).toEqual(false);
    expect(getSystemForc).toHaveBeenCalledTimes(1);

    expect(error).toHaveBeenCalledTimes(0);
  });
});
