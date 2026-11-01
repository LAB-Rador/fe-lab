import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import type { LabAnimalType } from "@/src/app/[labId]/settings/types"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"

type TypeDraft = { id: string | null; name: string; description: string }

export function AnimalTypesSettings({
    types,
    draft,
    busy,
    onDraft,
    onEdit,
    onCancel,
    onSave,
    onDelete,
}: {
    types: LabAnimalType[]
    draft: TypeDraft
    busy: boolean
    onDraft: (draft: TypeDraft) => void
    onEdit: (type: LabAnimalType) => void
    onCancel: () => void
    onSave: () => void
    onDelete: (type: LabAnimalType) => void
}) {
    return (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <Card>
                <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-lg">Animal types</CardTitle>
                    <CardDescription>Types used when an animal is added to this laboratory.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {types.length === 0 ? (
                        <p className="px-6 py-10 text-center text-sm text-gray-500">No animal types yet.</p>
                    ) : (
                        <Table>
                            <TableHeader className="bg-gray-50">
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Animals</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {types.map((type) => (
                                    <TableRow key={type.id}>
                                        <TableCell className="font-medium text-gray-900">{type.name}</TableCell>
                                        <TableCell className="max-w-xs whitespace-pre-wrap text-gray-600">{type.description || "—"}</TableCell>
                                        <TableCell>{type.animalCount}</TableCell>
                                        <TableCell className="text-right">
                                            <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(type)}>Edit</Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                disabled={busy || type.animalCount > 0}
                                                onClick={() => onDelete(type)}
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
                    <CardTitle className="text-lg">{draft.id ? "Edit type" : "New type"}</CardTitle>
                    <CardDescription>A type can be deleted only when no animal uses it.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                    <div className="space-y-2">
                        <Label htmlFor="animal-type-name">Name</Label>
                        <Input
                            id="animal-type-name"
                            value={draft.name}
                            onChange={(event) => onDraft({ ...draft, name: event.target.value })}
                            placeholder="Mouse"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="animal-type-description">Description</Label>
                        <Textarea
                            id="animal-type-description"
                            value={draft.description}
                            onChange={(event) => onDraft({ ...draft, description: event.target.value })}
                            placeholder="Optional"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button type="button" onClick={onSave} disabled={busy || !draft.name.trim()} className="bg-blue-600 hover:bg-blue-700">
                            {draft.id ? "Save changes" : "Add type"}
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
