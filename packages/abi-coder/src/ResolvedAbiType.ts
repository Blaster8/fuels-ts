import type { JsonAbi, JsonAbiArgument } from './types/JsonAbi.js';
import {
  arrayRegEx,
  enumRegEx,
  genericRegEx,
  stringRegEx,
  structRegEx,
} from './utils/constants.js';
import { findTypeById } from './utils/json-abi.js';

export class ResolvedAbiType {
  readonly abi: JsonAbi;
  name: string;
  readonly type: string;
  readonly originalTypeArguments: readonly JsonAbiArgument[] | null;
  readonly components: readonly ResolvedAbiType[] | null;

  constructor(abi: JsonAbi, argument: JsonAbiArgument) {
    this.abi = abi;

    this.name = argument.name;

    const type = findTypeById(abi, argument.type);
    this.type = type.type;
    this.originalTypeArguments = argument.typeArguments;
    this.components = ResolvedAbiType.getResolvedGenericComponents(
      abi,
      argument,
      type.components,
      type.typeParameters ?? ResolvedAbiType.getImplicitGenericTypeParameters(abi, type.components)
    );
  }

  private static getResolvedGenericComponents(
    abi: JsonAbi,
    arg: JsonAbiArgument,
    components: readonly JsonAbiArgument[] | null,
    typeParameters: readonly number[] | null
  ) {
    if (components === null) {
      return null;
    }
    if (typeParameters === null || typeParameters.length === 0) {
      return components.map((c) => new ResolvedAbiType(abi, c));
    }

    const typeParametersAndArgsMap = typeParameters.reduce(
      (obj, typeParameter, typeParameterIndex) => {
        const o: Record<number, JsonAbiArgument> = { ...obj };
        o[typeParameter] = structuredClone(
          arg.typeArguments?.[typeParameterIndex]
        ) as JsonAbiArgument;
        return o;
      },
      {} as Record<number, JsonAbiArgument>
    );

    const resolvedComponents = this.resolveGenericArgTypes(
      abi,
      components,
      typeParametersAndArgsMap
    );

    return resolvedComponents.map((c) => new ResolvedAbiType(abi, c));
  }

  private static resolveGenericArgTypes(
    abi: JsonAbi,
    args: readonly JsonAbiArgument[],
    typeParametersAndArgsMap: Record<number, JsonAbiArgument>
  ): readonly JsonAbiArgument[] {
    return args.map((arg) => {
      if (typeParametersAndArgsMap[arg.type] !== undefined) {
        return {
          ...typeParametersAndArgsMap[arg.type],
          name: arg.name,
        };
      }

      if (arg.typeArguments) {
        return {
          ...structuredClone(arg),
          typeArguments: this.resolveGenericArgTypes(
            abi,
            arg.typeArguments,
            typeParametersAndArgsMap
          ),
        };
      }

      const argType = findTypeById(abi, arg.type);
      const implicitTypeParameters = this.getImplicitGenericTypeParameters(abi, argType.components);

      if (implicitTypeParameters && implicitTypeParameters.length > 0) {
        return {
          ...structuredClone(arg),
          typeArguments: implicitTypeParameters.map((itp) => typeParametersAndArgsMap[itp]),
        };
      }

      return arg;
    });
  }

  private static getImplicitGenericTypeParameters(
    abi: JsonAbi,
    args: readonly JsonAbiArgument[] | null,
    implicitGenericParametersParam?: number[]
  ) {
    if (!Array.isArray(args)) {
      return null;
    }

    const implicitGenericParameters: number[] = implicitGenericParametersParam ?? [];

    args.forEach((a) => {
      const argType = findTypeById(abi, a.type);

      if (genericRegEx.test(argType.type)) {
        implicitGenericParameters.push(argType.typeId);
        return;
      }

      if (!Array.isArray(a.typeArguments)) {
        return;
      }
      this.getImplicitGenericTypeParameters(abi, a.typeArguments, implicitGenericParameters);
    });

    return implicitGenericParameters.length > 0 ? implicitGenericParameters : null;
  }

  getSignature(): string {
    const prefix = this.getArgSignaturePrefix();
    const content = this.getArgSignatureContent();

    return `${prefix}${content}`;
  }

  private getArgSignaturePrefix(): string {
    const structMatch = structRegEx.test(this.type);
    if (structMatch) {
      return 's';
    }

    const arrayMatch = arrayRegEx.test(this.type);
    if (arrayMatch) {
      return 'a';
    }

    const enumMatch = enumRegEx.test(this.type);
    if (enumMatch) {
      return 'e';
    }

    return '';
  }

  private getArgSignatureContent(): string {
    if (this.type === 'raw untyped ptr') {
      return 'rawptr';
    }

    if (this.type === 'raw untyped slice') {
      return 'rawslice';
    }

    const strMatch = stringRegEx.exec(this.type)?.groups;
    if (strMatch) {
      return `str[${strMatch.length}]`;
    }

    if (this.components === null) {
      return this.type;
    }

    const arrayMatch = arrayRegEx.exec(this.type)?.groups;

    if (arrayMatch) {
      return `[${this.components[0].getSignature()};${arrayMatch.length}]`;
    }

    const typeArgumentsSignature =
      this.originalTypeArguments !== null
        ? `<${this.originalTypeArguments
            .map((a) => new ResolvedAbiType(this.abi, a).getSignature())
            .join(',')}>`
        : '';

    const componentsSignature = `(${this.components.map((c) => c.getSignature()).join(',')})`;

    return `${typeArgumentsSignature}${componentsSignature}`;
  }
}
