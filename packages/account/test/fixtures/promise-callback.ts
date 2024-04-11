import type { Mock } from 'vitest';

import { deferPromise, type DeferPromise } from '../../src/connectors/utils/index.js';

export type PromiseCallback = Mock & {
  promise: DeferPromise;
};

export function promiseCallback() {
  const defer = deferPromise();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockFn: any = vi.fn();

  mockFn.mockImplementation((...args: unknown[]) => {
    defer.resolve(args);
  });
  mockFn.promise = defer.promise;

  return mockFn as PromiseCallback;
}
