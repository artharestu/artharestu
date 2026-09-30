export const categories = ["web", "mobile", "video"] as const;
export type Category = (typeof categories)[number];
