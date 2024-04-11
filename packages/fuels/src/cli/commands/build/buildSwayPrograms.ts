import type { FuelsConfig } from '../../types.js';
import { getBinarySource } from '../../utils/getBinarySource.js';
import { log } from '../../utils/logger.js';

import { buildSwayProgram } from './buildSwayProgram.js';

export async function buildSwayPrograms(config: FuelsConfig) {
  log(`Building Sway programs using ${getBinarySource(config.useBuiltinFuelCore)} 'forc' binary`);

  const paths = config.workspace
    ? [config.workspace]
    : [config.contracts, config.predicates, config.scripts].flat();

  await Promise.all(paths.map((path) => buildSwayProgram(config, path)));
}
