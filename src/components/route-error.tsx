"use client"

import { Button } from "@/src/components/ui/button"
import { useEffect } from "react"

export function RouteError({
  error,
  unstable_retry,
  fullPage = false,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
  fullPage?: boolean
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className={`flex flex-col items-center justify-center gap-3 p-6 text-center ${fullPage ? "min-h-screen" : "min-h-[40vh]"}`}>
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-sm text-muted-foreground">This page could not be loaded.</p>
      <Button type="button" onClick={() => unstable_retry()}>Try again</Button>
    </div>
  )
}
