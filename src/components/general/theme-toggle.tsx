"use client";

import { useAtom } from "jotai";
import { Sun, Moon } from "lucide-react";
import { app_theme } from "@/lib/atoms";
// import { useEffect } from "react";

const ThemeToggle = () => {
  const [theme, setTheme] = useAtom(app_theme);

  const changeTheme = () => {
    // localStorage.setItem(THEME_KEY, theme === "dark" ? "light" : "dark");

    setTheme((t) => (t === "dark" ? "light" : "dark"));

    document.body.classList.toggle("dark");
  };

  // useEffect(() => {
  // const t = localStorage.getItem(THEME_KEY) as "light" | "dark";

  // if (t) {
  // setTheme("dark");

  //   if (t === "dark") document.body.classList.add("dark");
  // } else {
  //   setTheme("dark");

  //   document.body.classList.add("dark");
  // }
  // }, []);

  return (
    <div className="cursor-pointer" onClick={changeTheme}>
      {theme === "dark" ? (
        <Sun className="w-5 h-auto dark:text-white text-black" />
      ) : (
        <Moon className="w-5 h-auto dark:text-white text-black" />
      )}
    </div>
  );
};

export default ThemeToggle;
