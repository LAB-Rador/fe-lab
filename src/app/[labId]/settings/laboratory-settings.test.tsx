import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import LaboratorySettings from "./laboratory-settings"

vi.mock("next/navigation", () => ({
    useRouter: () => ({ replace: vi.fn() }),
    usePathname: () => "/alpha/settings",
    useSearchParams: () => new URLSearchParams(),
}))

describe("Laboratory settings", () => {
    it("does not offer SMS or a role constructor", () => {
        render(
            <LaboratorySettings
                animalTypes={<p>Animal type list</p>}
                breedingProtocols={<p>Protocol list</p>}
                subscription={<p>Plan card</p>}
            />,
        )

        expect(screen.getByRole("tab", { name: "Animal Types" })).toBeTruthy()
        expect(screen.getByRole("tab", { name: "Breeding Protocols" })).toBeTruthy()
        expect(screen.getByRole("tab", { name: "Subscription" })).toBeTruthy()
        expect(screen.queryByRole("tab", { name: /sms/i })).toBeNull()
        expect(screen.queryByText("Create New Role")).toBeNull()
    })
})
