import type { IType } from '../../types/interfaces/IType.js';

import { AType } from './AType.js';

export class StrType extends AType implements IType {
  // Note: the str length expressed in '[3]' could be any length
  public static swayType = 'str[3]';

  public name = 'str';

  static MATCH_REGEX: RegExp = /^str\[(.+)\]$/m;

  static isSuitableFor(params: { type: string }) {
    return StrType.MATCH_REGEX.test(params.type);
  }

  public parseComponentsAttributes(_params: { types: IType[] }) {
    this.attributes = {
      inputLabel: 'string',
      outputLabel: 'string',
    };
    return this.attributes;
  }
}
