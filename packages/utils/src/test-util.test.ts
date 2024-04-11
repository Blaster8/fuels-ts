import * as indexMod from './test-utils.js';

/**
 * @group node
 */
describe('index.js', () => {
  test('should export all test utilities', () => {
    expect(indexMod.getForcProject).toBeTruthy();
  });
});
