import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { requestMagicLinkAction } from "@/src/app/signin/actions"
import { LoginForm } from "./login-form"

afterEach(() => {
    vi.restoreAllMocks()
})

describe("LoginForm", () => {
    it("does not send an empty email", async () => {
        const fetchMock = vi.spyOn(globalThis, "fetch")
        const user = userEvent.setup()
        render(<LoginForm />)

        await user.click(screen.getByRole("button", { name: "Email me a link" }))

        const data = new FormData()
        data.set("email", "   ")
        const result = await requestMagicLinkAction({}, data)

        expect(fetchMock).not.toHaveBeenCalled()
        expect(result.fieldErrors?.email?.[0]).toBe("Email is required")
    })

    it("shows the server response", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            json: async () => ({ message: "Mailbox unavailable" }),
        } as Response)
        const user = userEvent.setup()
        render(<LoginForm />)

        await user.type(screen.getByLabelText("Email address"), "person@lab.test")
        await user.click(screen.getByRole("button", { name: "Email me a link" }))

        expect(await screen.findByText("Mailbox unavailable")).toBeTruthy()
    })

    it("has no guest access button", () => {
        render(<LoginForm />)

        expect(screen.queryByRole("button", { name: /guest/i })).toBeNull()
        expect(screen.queryByText(/guest access/i)).toBeNull()
    })
})
