import { type Command } from 'commander';

import type { FuelsConfig } from '../../types.js';
import { log } from '../../utils/logger.js';
import { deploy } from '../deploy/index.js';
import { autoStartFuelCore } from '../dev/autoStartFuelCore.js';

import { buildSwayPrograms } from './buildSwayPrograms.js';
import { generateTypes } from './generateTypes.js';

export async function build(config: FuelsConfig, program?: Command) {
  log('Building..');

  await buildSwayPrograms(config);
  await generateTypes(config);

  const options = program?.opts();

  if (options?.deploy) {
    const fuelCore = await autoStartFuelCore(config);
    await deploy(config);
    fuelCore?.killChildProcess();
  }
}
