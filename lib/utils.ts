import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns the default dark-themed styles for react-hot-toast notifications.
 * Use this to maintain consistent toast styling across the codebase.
 *
 * @example
 * toast.success("Message", { style: toastStyles() })
 * toast.error("Error", { style: toastStyles() })
 */
export function toastStyles() {
  return {
    background: "#1a1a1a",
    color: "#fff",
    border: "1px solid #333",
    fontSize: "0.875rem",
  }
}
