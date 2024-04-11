import { readVersionsFromFiles } from '../../scripts/rewriteVersions.js';

import { getBuiltinVersions } from './getBuiltinVersions.js';

/**
 * @group node
 */
describe('getBuiltinVersions.js', () => {
  test('should return received version of default', () => {
    const versions = getBuiltinVersions();
    const versionsFromFiles = readVersionsFromFiles();

    expect(versions.FORC).toEqual(versionsFromFiles.FORC);
    expect(versions.FUEL_CORE).toEqual(versionsFromFiles.FUEL_CORE);
    expect(versions.FUELS).toEqual(versionsFromFiles.FUELS);
  });
});
