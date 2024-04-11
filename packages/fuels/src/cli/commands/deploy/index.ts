import {
  getBinaryPath,
  getABIPath,
  getContractName,
  getContractCamelCase,
  getStorageSlotsPath,
} from '../../config/forcUtils.js';
import type { FuelsConfig, DeployedContract } from '../../types.js';
import { debug, log } from '../../utils/logger.js';

import { createWallet } from './createWallet.js';
import { deployContract } from './deployContract.js';
import { getDeployConfig } from './getDeployConfig.js';
import { saveContractIds } from './saveContractIds.js';

export async function deploy(config: FuelsConfig) {
  const contracts: DeployedContract[] = [];

  const wallet = await createWallet(config.providerUrl, config.privateKey);

  log(`Deploying contracts to: ${wallet.provider.url}`);

  const contractsLen = config.contracts.length;

  for (let i = 0; i < contractsLen; i++) {
    const contractPath = config.contracts[i];
    const binaryPath = getBinaryPath(contractPath, config);
    const abiPath = getABIPath(contractPath, config);
    const storageSlotsPath = getStorageSlotsPath(contractPath, config);
    const projectName = getContractName(contractPath);
    const contractName = getContractCamelCase(contractPath);
    const deployConfig = await getDeployConfig(config.deployConfig, {
      contracts: Array.from(contracts),
      contractName,
      contractPath,
    });

    const contractId = await deployContract(
      wallet,
      binaryPath,
      abiPath,
      storageSlotsPath,
      deployConfig
    );

    debug(`Contract deployed: ${projectName} - ${contractId}`);

    contracts.push({
      name: contractName,
      contractId,
    });
  }

  await saveContractIds(contracts, config.output);

  return contracts;
}
