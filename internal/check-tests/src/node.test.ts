import { testEach } from './index.js';

/**
 * @group node
 */
describe('in:node', () => {
  it('should work on node', () => {
    expect(testEach()).toEqual('node');
  });
});
