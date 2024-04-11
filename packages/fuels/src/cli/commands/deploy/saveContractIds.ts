import { writeFile, mkdir } from 'fs/promises';
import { resolve } from 'path';

import type { DeployedContract } from '../../types.js';
import { log } from '../../utils/logger.js';

export async function saveContractIds(contracts: DeployedContract[], output: string) {
  const contractsMap = contracts.reduce(
    (cConfig, { name, contractId }) => ({
      ...cConfig,
      [name]: contractId,
    }),
    {}
  );

  const filePath = resolve(output, 'contract-ids.json');

  await mkdir(output, { recursive: true });
  await writeFile(filePath, JSON.stringify(contractsMap, null, 2));

  log(`Contract IDs saved at: ${filePath}`);
}
