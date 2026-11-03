"use client"

import { AnimalTypesSettings } from "@/src/components/settings/animal-type-settings"
import { BreedingProtocolsSettings } from "@/src/components/settings/breeding-protocols-settings"
import { SubscriptionSettings } from "@/src/components/settings/subscription-settings"
import LaboratorySettings from "./laboratory-settings"
import { readAnimalType, readBreedingProtocol, type LabAnimalType, type LabBreedingProtocol, type LabSubscription } from "./types"
import { apiClient } from "@/src/lib/apiClient"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type TypeDraft = { id: string | null; name: string; description: string }
type ProtocolDraft = { id: string | null; name: string; description: string; instructions: string; animalTypeId: string }

const emptyType = (): TypeDraft => ({ id: null, name: "", description: "" })
const emptyProtocol = (): ProtocolDraft => ({ id: null, name: "", description: "", instructions: "", animalTypeId: "" })

function messageFrom(error: unknown, fallback: string) {
    const text = error instanceof Error ? error.message : ""
    if (text.includes("409")) return "That name is already used, or this item is still in use."
    if (text.includes("400")) return "Enter a name and, for a protocol, an animal type."
    return fallback
}

function byName<T extends { name: string }>(rows: T[]) {
    return [...rows].sort((left, right) => left.name.localeCompare(right.name))
}

export default function SettingsContainer({
    userId,
    labId,
    animalTypes,
    protocols,
    subscription,
    error,
}: {
    userId: string
    labId: string
    animalTypes: LabAnimalType[]
    protocols: LabBreedingProtocol[]
    subscription: LabSubscription | null
    error: string | null
}) {
    const [types, setTypes] = useState(animalTypes)
    const [protocolRows, setProtocolRows] = useState(protocols)
    const [typeDraft, setTypeDraft] = useState<TypeDraft>(emptyType)
    const [protocolDraft, setProtocolDraft] = useState<ProtocolDraft>(emptyProtocol)
    const [busy, setBusy] = useState(false)

    useEffect(() => {
        if (error) toast.error(error)
    }, [error])

    const saveType = async () => {
        const name = typeDraft.name.trim()
        if (!name) {
            toast.error("Enter a name.")
            return
        }
        const body = { name, description: typeDraft.description.trim() }
        setBusy(true)
        try {
            const response = typeDraft.id
                ? await apiClient.put(`/api/animals/types/${userId}/${labId}/${typeDraft.id}`, body)
                : await apiClient.post(`/api/animals/types/${userId}/${labId}`, body)
            const saved = readAnimalType(response?.data)
            if (!saved) {
                toast.error("Could not save the animal type.")
                return
            }
            setTypes((current) => byName([saved, ...current.filter((type) => type.id !== saved.id)]))
            setTypeDraft(emptyType())
            toast.success(typeDraft.id ? "Animal type updated" : "Animal type created", { description: saved.name })
        } catch (cause) {
            toast.error(messageFrom(cause, "Could not save the animal type."))
        } finally {
            setBusy(false)
        }
    }

    const removeType = async (type: LabAnimalType) => {
        setBusy(true)
        try {
            await apiClient.delete(`/api/animals/types/${userId}/${labId}/${type.id}`)
            setTypes((current) => current.filter((item) => item.id !== type.id))
            if (typeDraft.id === type.id) setTypeDraft(emptyType())
            toast.success("Animal type deleted", { description: type.name })
        } catch (cause) {
            toast.error(messageFrom(cause, "Could not delete the animal type."))
        } finally {
            setBusy(false)
        }
    }

    const saveProtocol = async () => {
        const name = protocolDraft.name.trim()
        if (!name || !protocolDraft.animalTypeId) {
            toast.error("Enter a name and an animal type.")
            return
        }
        const body = {
            name,
            animalTypeId: protocolDraft.animalTypeId,
            description: protocolDraft.description.trim(),
            instructions: protocolDraft.instructions.trim(),
        }
        setBusy(true)
        try {
            const response = protocolDraft.id
                ? await apiClient.put(`/api/breedings/${userId}/${labId}/protocols/${protocolDraft.id}`, body)
                : await apiClient.post(`/api/breedings/${userId}/${labId}/protocols`, body)
            const saved = readBreedingProtocol(response?.data)
            if (!saved) {
                toast.error("Could not save the protocol.")
                return
            }
            setProtocolRows((current) => byName([saved, ...current.filter((protocol) => protocol.id !== saved.id)]))
            setProtocolDraft(emptyProtocol())
            toast.success(protocolDraft.id ? "Protocol updated" : "Protocol created", { description: saved.name })
        } catch (cause) {
            toast.error(messageFrom(cause, "Could not save the protocol."))
        } finally {
            setBusy(false)
        }
    }

    const removeProtocol = async (protocol: LabBreedingProtocol) => {
        setBusy(true)
        try {
            await apiClient.delete(`/api/breedings/${userId}/${labId}/protocols/${protocol.id}`)
            setProtocolRows((current) => current.filter((item) => item.id !== protocol.id))
            if (protocolDraft.id === protocol.id) setProtocolDraft(emptyProtocol())
            toast.success("Protocol deleted", { description: protocol.name })
        } catch (cause) {
            toast.error(messageFrom(cause, "Could not delete the protocol."))
        } finally {
            setBusy(false)
        }
    }

    return (
        <LaboratorySettings
            animalTypes={(
                <AnimalTypesSettings
                    types={types}
                    draft={typeDraft}
                    busy={busy}
                    onDraft={setTypeDraft}
                    onEdit={(type) => setTypeDraft({ id: type.id, name: type.name, description: type.description })}
                    onCancel={() => setTypeDraft(emptyType())}
                    onSave={() => void saveType()}
                    onDelete={(type) => void removeType(type)}
                />
            )}
            breedingProtocols={(
                <BreedingProtocolsSettings
                    protocols={protocolRows}
                    animalTypes={types}
                    draft={protocolDraft}
                    busy={busy}
                    onDraft={setProtocolDraft}
                    onEdit={(protocol) => setProtocolDraft({
                        id: protocol.id,
                        name: protocol.name,
                        description: protocol.description,
                        instructions: protocol.instructions,
                        animalTypeId: protocol.animalTypeId,
                    })}
                    onCancel={() => setProtocolDraft(emptyProtocol())}
                    onSave={() => void saveProtocol()}
                    onDelete={(protocol) => void removeProtocol(protocol)}
                />
            )}
            subscription={<SubscriptionSettings subscription={subscription} />}
        />
    )
}
