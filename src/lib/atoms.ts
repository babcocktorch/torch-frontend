import { atom } from "jotai";

const app_theme = atom<"light" | "dark">("light");

export { app_theme };
