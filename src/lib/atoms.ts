import { atom } from "jotai";

const app_theme = atom<"light" | "dark">("light");
const is_categories_at_viewport_edge = atom<boolean>(false);

export { app_theme, is_categories_at_viewport_edge };
