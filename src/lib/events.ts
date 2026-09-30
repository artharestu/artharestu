import type { Category } from "@/data/categories";

/** Services → Portfolio: "See work →" asks the portfolio to switch its filter. */
export const FILTER_EVENT = "portfolio:filter";
export type FilterEventDetail = { category: Category };

/** Hero showcase → Portfolio: open a project's modal. The portfolio cancels the event when it handles it. */
export const OPEN_EVENT = "portfolio:open";
export type OpenEventDetail = { slug: string; trigger: HTMLElement };
