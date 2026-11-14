import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Sidebar } from "./sidebar"

const { logout } = vi.hoisted(() => ({ logout: vi.fn() }))

vi.mock("next/link", () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))

vi.mock("next/navigation", () => ({
    useParams: () => ({ labId: "alpha" }),
    usePathname: () => "/alpha/animals",
    useRouter: () => ({ push: vi.fn() }),
}))

vi.mock("@/src/components/sidebar-provider", () => ({
    useSidebar: () => ({ isOpen: true, toggle: vi.fn(), close: vi.fn() }),
}))

vi.mock("@/src/lib/auth", () => ({
    AuthService: { logout },
}))

describe("Sidebar", () => {
    it("logs out through the shared auth service", async () => {
        const user = userEvent.setup()
        render(<Sidebar laboratoryName="Alpha Lab" />)

        await user.click(screen.getByRole("button", { name: "Log out" }))

        expect(logout).toHaveBeenCalledOnce()
    })
})
