import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import type { LabSubscription } from "@/src/app/[labId]/settings/types"
import { SubscriptionSettings } from "./subscription-settings"

const startDate = "2026-04-02T15:00:00.000Z"
const endDate = "2027-04-02T15:00:00.000Z"

function writtenDate(value: string) {
    return new Date(value).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    })
}

const subscription: LabSubscription = {
    memberCount: 3,
    planName: "Lab",
    maxUsers: 5,
    startDate,
    endDate,
}

describe("SubscriptionSettings", () => {
    it("shows the seat count, dates, and plan badge without a payment button", () => {
        render(<SubscriptionSettings subscription={subscription} />)

        expect(screen.getByText("3 of 5")).toBeTruthy()
        expect(screen.getByText("Lab")).toBeTruthy()
        expect(screen.getByText(writtenDate(startDate))).toBeTruthy()
        expect(screen.getByText(writtenDate(endDate))).toBeTruthy()
        expect(screen.queryByRole("button")).toBeNull()
        expect(screen.queryByText(/pay|checkout|upgrade|stripe/i)).toBeNull()
    })
})
