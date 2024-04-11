import type { IConfigurable } from '../../types/interfaces/IConfigurable.js';
import type { IRawAbiConfigurable } from '../../types/interfaces/IRawAbiConfigurable.js';
import type { IType } from '../../types/interfaces/IType.js';
import { findType } from '../../utils/findType.js';

export class Configurable implements IConfigurable {
  public name: string;
  public type: IType;
  public rawAbiConfigurable: IRawAbiConfigurable;

  constructor(params: { types: IType[]; rawAbiConfigurable: IRawAbiConfigurable }) {
    const { types, rawAbiConfigurable } = params;

    this.name = rawAbiConfigurable.name;
    this.rawAbiConfigurable = rawAbiConfigurable;
    this.type = findType({ types, typeId: rawAbiConfigurable.configurableType.type });
  }
}
