"use client"

import { Suspense } from "react"
import LaboratorySettings from "./laboratory-settings"

export default function Page() {
    return (
        <div>
            <Suspense>
                <LaboratorySettings />
            </Suspense>
        </div>
    )
}
