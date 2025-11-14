import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const readTime = (text: string) => {
  const wordsPerMinute = 200;
  const noOfWords = text.split(/\s/g).length;
  const minutes = noOfWords / wordsPerMinute;
  const readTime = Math.ceil(minutes);
  return `${readTime} minute read`;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const isValidEmail = (email: string) =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(email);

export const getDayMonthYear = (datePublished: string) => {
  const date = new Date(datePublished);

  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return { day, month, year };
};

export const generateColorsFromString = (text: string) => {
  // 1. Hash the string to get a consistent number
  let hash = 0;

  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32-bit integer
  }

  // 2. Generate RGB values from the hash
  const r = (hash >> 16) & 0xff;
  const g = (hash >> 8) & 0xff;
  const b = hash & 0xff;

  // 3. Convert RGB to hex
  const backgroundColor = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  // 4. Calculate perceived brightness (0-255)
  // Using the standard luminance formula
  const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

  // 5. Choose white or black text based on brightness
  // Threshold of 128 works well (or use 186 for stricter contrast)
  const textColor = brightness > 128 ? "#000000" : "#ffffff";

  return { backgroundColor, textColor };
};
