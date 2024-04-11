import { ErrorCode, FuelError } from '@fuel-ts/errors';
import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import mkdirp from 'mkdirp';
import { basename } from 'path';
import rimraf from 'rimraf';

import { AbiTypeGen } from './AbiTypeGen.js';
import type { ProgramTypeEnum } from './types/enums/ProgramTypeEnum.js';
import type { IFile } from './types/interfaces/IFile.js';
import { collectBinFilepaths } from './utils/collectBinFilePaths.js';
import { collectStorageSlotsFilepaths } from './utils/collectStorageSlotsFilePaths.js';

export interface IGenerateFilesParams {
  cwd: string;
  filepaths?: string[];
  inputs?: string[];
  output: string;
  silent?: boolean;
  programType: ProgramTypeEnum;
}

export function runTypegen(params: IGenerateFilesParams) {
  const { cwd, inputs, output, silent, programType, filepaths: inputFilepaths } = params;

  const cwdBasename = basename(cwd);

  function log(...args: unknown[]) {
    if (!silent) {
      process.stdout.write(`${args.join(' ')}\n`);
    }
  }

  /*
    Assembling files array and expanding globals if needed
  */
  let filepaths: string[] = [];

  if (!inputFilepaths?.length && inputs?.length) {
    filepaths = inputs.flatMap((i) => globSync(i, { cwd }));
  } else if (inputFilepaths?.length) {
    filepaths = inputFilepaths;
  } else {
    throw new FuelError(
      ErrorCode.MISSING_REQUIRED_PARAMETER,
      `At least one parameter should be supplied: 'input' or 'filepaths'.`
    );
  }

  /*
    Assembling file paths x contents
  */
  const abiFiles = filepaths.map((filepath) => {
    const abi: IFile = {
      path: filepath,
      contents: readFileSync(filepath, 'utf-8'),
    };
    return abi;
  });

  if (!abiFiles.length) {
    throw new FuelError(ErrorCode.NO_ABIS_FOUND, `no ABI found at '${inputs}'`);
  }

  const binFiles = collectBinFilepaths({ filepaths, programType });

  const storageSlotsFiles = collectStorageSlotsFilepaths({ filepaths, programType });

  /*
    Starting the engine
  */
  const abiTypeGen = new AbiTypeGen({
    outputDir: output,
    abiFiles,
    binFiles,
    storageSlotsFiles,
    programType,
  });

  /*
    Generating files
  */
  log('Generating files..\n');

  mkdirp.sync(`${output}/factories`);

  abiTypeGen.files.forEach((file) => {
    rimraf.sync(file.path);
    writeFileSync(file.path, file.contents);
    const trimPathRegex = new RegExp(`^.+${cwdBasename}/`, 'm');
    log(` - ${file.path.replace(trimPathRegex, '')}`);
  });

  log('\nDone.⚡');
}
