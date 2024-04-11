import type { Contract, Bytes } from 'fuels';

import { DocSnippetProjectsEnum } from '../../../test/fixtures/forc-projects/index.js';
import { createAndDeployContractFromProject } from '../../utils.js';

/**
 * @group node
 */
describe('Bytes', () => {
  let contract: Contract;

  beforeAll(async () => {
    contract = await createAndDeployContractFromProject(DocSnippetProjectsEnum.ECHO_BYTES);
  });

  it('should pass bytes to a contract', async () => {
    // #region bytes-1
    // #import { Bytes };

    const bytes: Bytes = [40, 41, 42];

    const { value } = await contract.functions.bytes_comparison(bytes).simulate();

    expect(value).toBeTruthy();
    // #endregion bytes-1
  });

  it('should retrieve bytes from a contract', async () => {
    // #region bytes-2
    // #import { Bytes };

    const bytes: Bytes = [8, 42, 77];

    const { value } = await contract.functions.echo_bytes(bytes).simulate();

    expect(value).toStrictEqual(new Uint8Array(bytes));
    // #endregion bytes-2
  });
});
