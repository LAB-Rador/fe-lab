"use client"

import { useMediaQuery } from "@/src/components/sidebar-provider"
import { useEffect, useState } from "react"

const DEFAULT_MOBILE_MEDIA = "(max-width: 768px)"

/**
 * Mirrors animals list: narrow viewport prefers grid cards, wide prefers table.
 * Manual override via returned `setView` (toggle buttons remain possible).
 */
export function useResponsiveTableGridView(mediaQuery: string = DEFAULT_MOBILE_MEDIA) {
  const isNarrowViewport = useMediaQuery(mediaQuery)
  const [view, setView] = useState<"table" | "grid">("table")

  useEffect(() => {
    setView(isNarrowViewport ? "grid" : "table")
  }, [isNarrowViewport])

  return { view, setView, isNarrowViewport }
}
