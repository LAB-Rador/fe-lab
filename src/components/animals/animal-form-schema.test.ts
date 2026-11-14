import { describe, expect, it } from "vitest"
import { addAnimalFormSchema, editAnimalFormSchema } from "./animal-form-schema"

const laboratoryId = "11111111-1111-4111-8111-111111111111"

describe("add animal form", () => {
    it("requires an identifier", () => {
        const result = addAnimalFormSchema.safeParse({
            identifier: "",
            animalTypeId: "22222222-2222-4222-8222-222222222222",
            laboratoryId,
        })

        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.flatten().fieldErrors.identifier?.[0]).toBe("Identifier is required")
        }
    })

    it("rejects an empty animal type", () => {
        const result = addAnimalFormSchema.safeParse({
            identifier: "M-1",
            animalTypeId: "",
            laboratoryId,
        })

        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.flatten().fieldErrors.animalTypeId?.[0]).toBe("Animal type is required")
        }
    })

    it("rejects an empty identifier on the edit form", () => {
        const result = editAnimalFormSchema.safeParse({
            id: "33333333-3333-4333-8333-333333333333",
            identifier: "",
            animalTypeId: "",
            laboratoryId,
        })

        expect(result.success).toBe(false)
        if (!result.success) {
            const fields = result.error.flatten().fieldErrors
            expect(fields.identifier?.[0]).toBe("Identifier is required")
            expect(fields.animalTypeId?.[0]).toBe("Animal type is required")
        }
    })
})
