import type { BNInput } from './bn.js';
import { bn } from './bn.js';
import type { FormatConfig } from './types.js';

/**
 * Functional shortcuts
 */

// Shortcut to bn(value).toNumber
export function toNumber(value: BNInput): number {
  return bn(value).toNumber();
}

// Shortcut to bn(value).toHex
export function toHex(value: BNInput, bytesPadding?: number): string {
  return bn(value).toHex(bytesPadding);
}

// Shortcut to bn(value).toBytes
export function toBytes(value: BNInput, bytesPadding?: number): Uint8Array {
  return bn(value).toBytes(bytesPadding);
}

// Shortcut to bn.(value).formatUnits
export function formatUnits(value: BNInput, units?: number): string {
  return bn(value).formatUnits(units);
}

// Shortcut to bn.(value).format
export function format(value: BNInput, options?: FormatConfig): string {
  return bn(value).format(options);
}
