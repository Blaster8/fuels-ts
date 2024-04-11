#!/usr/bin/env node
import { error } from './cli/utils/logger.js';
import { run } from './run.js';

try {
  run(process.argv).catch(process.stderr.write);
} catch (err: unknown) {
  error((err as Error)?.message || err);
  process.exit(1);
}
