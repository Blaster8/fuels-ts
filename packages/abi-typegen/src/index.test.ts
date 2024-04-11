import * as indexMod from './index.js';

/**
 * @group node
 */
describe('index.ts', () => {
  test('should export AbiTypeGen class', () => {
    expect(indexMod.AbiTypeGen).toBeTruthy();
  });
});
