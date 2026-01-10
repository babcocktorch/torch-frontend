import { atom } from "jotai";

const app_theme = atom<"light" | "dark">("light");

// Torch AI sidebar state - open by default
const torch_ai_sidebar_open = atom<boolean>(true);

export { app_theme, torch_ai_sidebar_open };
