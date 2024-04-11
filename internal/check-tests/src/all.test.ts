import { testAll } from './index.js';

/**
 * @group node
 * @group browser
 */
describe('in:everywhere', () => {
  it('should work everywhere', () => {
    expect(testAll()).toEqual('thank you');
  });
});
