import type { IType } from '../../types/interfaces/IType.js';

import { U8Type } from './U8Type.js';

export class U16Type extends U8Type implements IType {
  public static swayType = 'u16';

  public name = 'u16';

  public static MATCH_REGEX: RegExp = /^u16$/m;

  static isSuitableFor(params: { type: string }) {
    return U16Type.MATCH_REGEX.test(params.type);
  }
}
