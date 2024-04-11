import * as indexMod from './test-utils.js';

/**
 * @group node
 * @group browser
 */
describe('test utils', () => {
  test('should export all test utilities', () => {
    expect(indexMod.expectToThrowFuelError).toBeTruthy();
    expect(indexMod.safeExec).toBeTruthy();
  });
});
