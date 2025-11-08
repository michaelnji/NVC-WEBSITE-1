import type React from "react"
import { cn } from "@/lib/utils"

interface ContainerProps {
  children: React.ReactNode
  className?: string
  as?: "div" | "section" | "main" | "article" | "aside"
}

/**
 * Container component that provides consistent horizontal padding
 * aligned with the navbar across all screen sizes.
 *
 * Use this component to wrap page content and sections to ensure
 * proper alignment throughout the site.
 */
export function Container({ children, className, as: Component = "div" }: ContainerProps) {
  return <Component className={cn("w-full px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32", className)}>{children}</Component>
}
