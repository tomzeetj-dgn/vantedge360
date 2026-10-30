import { memo, type ComponentType } from 'react';

/*
 * Re-render a section only when the data it shows changes. Handler props are
 * recreated on every parent render but always call the same instance methods,
 * so they are ignored in the comparison (JSON.stringify drops functions).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function memoByData<P extends Record<string, any>>(C: ComponentType<P>) {
  return memo(C, (a, b) => JSON.stringify(a) === JSON.stringify(b));
}
