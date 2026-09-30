"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** true only after hydration — for values that differ between server and client. */
export function useMounted() {
  return useSyncExternalStore(noop, () => true, () => false);
}
