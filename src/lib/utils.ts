import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`
}

export function calculateProgress(startDate?: string, endDate?: string): number {
  if (!startDate) return 0;
  const now = Date.now();
  const start = new Date(startDate).getTime();
  if (now < start) return 0;
  if (!endDate) return 0;
  const end = new Date(endDate).getTime();
  if (now >= end) return 100;
  return Math.round(((now - start) / (end - start)) * 100);
}