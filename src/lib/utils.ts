import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function removeParentheses(url: string): string {
  const cleanedUrl = url.replace(/\([^)]*\)\//g, '');
  return cleanedUrl;
}
