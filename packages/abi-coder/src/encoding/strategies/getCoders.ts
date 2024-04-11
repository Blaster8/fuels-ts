import type { ResolvedAbiType } from '../../ResolvedAbiType.js';
import type { EncodingOptions } from '../../types/EncodingOptions.js';
import type { GetCoderFn } from '../../types/GetCoder.js';
import type { Coder } from '../coders/AbstractCoder.js';

/**
 * @param components - types array to create coders for.
 * @param options - options - options to be utilized during the encoding process.
 * @returns an object containing types and an appropriate coder.
 */
export function getCoders(
  components: readonly ResolvedAbiType[],
  options: EncodingOptions & { getCoder: GetCoderFn }
) {
  const { getCoder } = options;
  return components.reduce((obj, component) => {
    const o: Record<string, Coder> = obj;

    o[component.name] = getCoder(component, options);
    return o;
  }, {});
}
