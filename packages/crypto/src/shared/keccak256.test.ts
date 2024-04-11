import { bufferFromString } from '../index.js';

import { keccak256 as keccak } from './keccak256.js';

const data = bufferFromString('hashedKey');

vi.mock('@noble/hashes/sha3', () => ({
  keccak_256: vi.fn(() => data),
}));

/**
 * @group node
 */
describe('keccak256', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('hashes using keccak256', () => {
    const hashedKey = keccak(data);

    expect(hashedKey).toEqual(data);
  });
});
