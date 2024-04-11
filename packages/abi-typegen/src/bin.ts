#!/usr/bin/env node
import { run } from './cli.js';

run({
  argv: process.argv,
  programName: 'fuels-typegen',
});
