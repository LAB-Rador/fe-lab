import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import type { LabAnimalType, LabBreedingProtocol } from "@/src/app/[labId]/settings/types"
import { Button } from "@/src/components/ui/button"
import { Textarea } from "@/src/components/ui/textarea"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"

type ProtocolDraft = {
    id: string | null
    name: string
    description: string
    instructions: string
    animalTypeId: string
}

export function BreedingProtocolsSettings({
    protocols,
    animalTypes,
    draft,
    busy,
    onDraft,
    onEdit,
    onCancel,
    onSave,
    onDelete,
}: {
    protocols: LabBreedingProtocol[]
    animalTypes: LabAnimalType[]
    draft: ProtocolDraft
    busy: boolean
    onDraft: (draft: ProtocolDraft) => void
    onEdit: (protocol: LabBreedingProtocol) => void
    onCancel: () => void
    onSave: () => void
    onDelete: (protocol: LabBreedingProtocol) => void
}) {
    return (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <Card>
                <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-lg">Breeding protocols</CardTitle>
                    <CardDescription>Choose one of these when recording a breeding pair of the same animal type.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {protocols.length === 0 ? (
                        <p className="px-6 py-10 text-center text-sm text-gray-500">No breeding protocols yet.</p>
                    ) : (
                        <Table>
                            <TableHeader className="bg-gray-50">
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Animal type</TableHead>
                                    <TableHead>Pairs</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {protocols.map((protocol) => (
                                    <TableRow key={protocol.id}>
                                        <TableCell className="font-medium text-gray-900">{protocol.name}</TableCell>
                                        <TableCell>{protocol.animalTypeName}</TableCell>
                                        <TableCell>{protocol.pairCount}</TableCell>
                                        <TableCell className="text-right">
                                            <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(protocol)}>Edit</Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                disabled={busy || protocol.pairCount > 0}
                                                onClick={() => onDelete(protocol)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-lg">{draft.id ? "Edit protocol" : "New protocol"}</CardTitle>
                    <CardDescription>Name, animal type, and the instructions staff should follow.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                    <div className="space-y-2">
                        <Label htmlFor="protocol-name">Name</Label>
                        <Input
                            id="protocol-name"
                            value={draft.name}
                            onChange={(event) => onDraft({ ...draft, name: event.target.value })}
                            placeholder="Standard pair"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Animal type</Label>
                        <Select
                            value={draft.animalTypeId || undefined}
                            onValueChange={(animalTypeId) => onDraft({ ...draft, animalTypeId })}
                            disabled={animalTypes.length === 0}
                        >
                            <SelectTrigger aria-label="Animal type">
                                <SelectValue placeholder={animalTypes.length === 0 ? "Add an animal type first" : "Select animal type"} />
                            </SelectTrigger>
                            <SelectContent>
                                {animalTypes.map((type) => (
                                    <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="protocol-description">Description</Label>
                        <Textarea
                            id="protocol-description"
                            value={draft.description}
                            onChange={(event) => onDraft({ ...draft, description: event.target.value })}
                            placeholder="Optional"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="protocol-instructions">Instructions</Label>
                        <Textarea
                            id="protocol-instructions"
                            value={draft.instructions}
                            onChange={(event) => onDraft({ ...draft, instructions: event.target.value })}
                            placeholder="Optional"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            onClick={onSave}
                            disabled={busy || !draft.name.trim() || !draft.animalTypeId}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {draft.id ? "Save changes" : "Add protocol"}
                        </Button>
                        {draft.id ? (
                            <Button type="button" variant="outline" onClick={onCancel} disabled={busy}>Cancel</Button>
                        ) : null}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
