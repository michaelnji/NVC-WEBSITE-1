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

/**
 * Parse project image_url which may contain multiple comma-separated URLs.
 * Returns an array of image URLs.
 *
 * @param imageUrl - The image_url from a project (single URL or comma-separated)
 * @returns Array of image URLs
 */
export function parseProjectImages(imageUrl: string | undefined | null): string[] {
  if (!imageUrl) return []
  return imageUrl.split(",").map((url) => url.trim()).filter(Boolean)
}

/**
 * Get the first/primary image from a project's image_url.
 * Useful for thumbnails and preview cards.
 *
 * @param imageUrl - The image_url from a project (single URL or comma-separated)
 * @param fallback - Fallback URL if no image found
 * @returns The first image URL or fallback
 */
export function getPrimaryImage(imageUrl: string | undefined | null, fallback = "/placeholder.svg"): string {
  const images = parseProjectImages(imageUrl)
  return images[0] || fallback
}
