import { fuelsConfig } from '../../test/fixtures/fuels.config.js';

import type {
  CommandEvent,
  Commands,
  DeployedContract,
  ContractDeployOptions,
  FuelsConfig,
  OptionsFunction,
  UserFuelsConfig,
} from './index.js';
import { createConfig } from './index.js';

/**
 * @group node
 */
describe('cli/index.ts', () => {
  test('should create config via cli index', () => {
    expect(createConfig(fuelsConfig)).toEqual(fuelsConfig);
  });

  test('ensure types are exported in cli index', () => {
    const types:
      | Commands
      | CommandEvent
      | DeployedContract
      | ContractDeployOptions
      | OptionsFunction
      | UserFuelsConfig
      | FuelsConfig
      | UserFuelsConfig
      | null = null;
    expect(types).not.toBeTruthy();
  });
});
