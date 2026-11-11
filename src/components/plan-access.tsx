"use client"

import { createContext, useContext } from "react"
import type React from "react"

const PlanAccessContext = createContext(false)

export function PlanAccessProvider({
    paidFeatures,
    children,
}: {
    paidFeatures: boolean
    children: React.ReactNode
}) {
    return <PlanAccessContext.Provider value={paidFeatures}>{children}</PlanAccessContext.Provider>
}

export function usePaidFeatures() {
    return useContext(PlanAccessContext)
}
