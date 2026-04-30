"use client"

import { useEffect, useRef, useState } from "react"

function easeOutCubic(t: number) {
    return 1 - (1 - t) ** 3
}

export interface CountUpProps {
    value: number
    durationMs?: number
    decimals?: number
    prefix?: string
    suffix?: string
    className?: string
}

export function CountUp({
    value,
    durationMs = 1200,
    decimals = 0,
    prefix = "",
    suffix = "",
    className,
}: CountUpProps) {
    const [display, setDisplay] = useState(0)
    const startRef = useRef<number | null>(null)
    const fromRef = useRef(0)
    const rafRef = useRef<number | null>(null)

    useEffect(() => {
        startRef.current = null
        const from = fromRef.current
        const to = value

        const tick = (now: number) => {
            if (startRef.current === null) startRef.current = now
            const elapsed = now - startRef.current
            const p = Math.min(1, elapsed / durationMs)
            const eased = easeOutCubic(p)
            const next = from + (to - from) * eased
            setDisplay(next)
            if (p < 1) {
                rafRef.current = requestAnimationFrame(tick)
            } else {
                fromRef.current = to
            }
        }

        rafRef.current = requestAnimationFrame(tick)
        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
        }
    }, [value, durationMs])

    const text = `${prefix}${display.toFixed(decimals)}${suffix}`
    return <span className={className}>{text}</span>
}
