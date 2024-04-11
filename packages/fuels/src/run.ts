import { configureCli } from './cli.js';

export const run = async (argv: string[]) => {
  const program = configureCli();
  return program.parseAsync(argv);
};
