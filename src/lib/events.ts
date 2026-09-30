import type { Category } from "@/data/categories";

/** Services → Portfolio: "See work →" asks the portfolio to switch its filter. */
export const FILTER_EVENT = "portfolio:filter";
export type FilterEventDetail = { category: Category };
