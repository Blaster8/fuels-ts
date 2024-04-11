import { join } from 'path';

import type { Abi } from '../abi/Abi.js';
import type { IFile } from '../index.js';
import { renderCommonTemplate } from '../templates/common/common.js';
import { renderIndexTemplate } from '../templates/common/index.js';
import { renderFactoryTemplate } from '../templates/script/factory.js';

/**
 * Render all Script-related templates and returns
 * an array of `IFile` with them all. For here on,
 * the only thing missing is to write them to disk.
 */
export function assembleScripts(params: { abis: Abi[]; outputDir: string }) {
  const { abis, outputDir } = params;

  const files: IFile[] = [];
  const usesCommonTypes = abis.find((a) => a.commonTypesInUse.length > 0);

  abis.forEach((abi) => {
    const { name } = abi;

    const factoryFilepath = `${outputDir}/factories/${name}__factory.ts`;

    const factory: IFile = {
      path: factoryFilepath,
      contents: renderFactoryTemplate({ abi }),
    };

    files.push(factory);
  });

  // Includes index file
  const indexFile: IFile = {
    path: `${outputDir}/index.ts`,
    contents: renderIndexTemplate({ abis }),
  };

  files.push(indexFile);

  // Conditionally includes `common.d.ts` file if needed
  if (usesCommonTypes) {
    const commonsFilepath = join(outputDir, 'common.d.ts');
    const file: IFile = {
      path: commonsFilepath,
      contents: renderCommonTemplate(),
    };
    files.push(file);
  }

  return files;
}
