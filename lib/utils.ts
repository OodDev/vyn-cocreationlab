import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind-aware className joiner (shadcn/ui convention). */
export function cn(...inputs: Array<ClassValue>): string {
  return twMerge(clsx(inputs));
}
