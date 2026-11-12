"use client"

import { RouteError } from "@/src/components/route-error"
import "@/src/app/globals.css"

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  return (
    <html lang="en">
      <body>
        <RouteError error={error} unstable_retry={unstable_retry} fullPage />
      </body>
    </html>
  )
}
