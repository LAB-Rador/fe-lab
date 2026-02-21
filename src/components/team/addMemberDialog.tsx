import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import type { AnimalEnums, NewMemberTypes } from "@/src/app/[labId]/team/types"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Plus } from "lucide-react"

interface AddMemberDialogProps {
    setNewMember: (newMember: NewMemberTypes) => void;
    setIsAddDialogOpen: (open: boolean) => void;
    handleAddMember: () => void;
    newMember: NewMemberTypes;
    isAddDialogOpen: boolean;
    animalEnums: AnimalEnums;
}

export const AddMemberDialog = (props: AddMemberDialogProps) => {
    const { setNewMember, setIsAddDialogOpen, handleAddMember, newMember, isAddDialogOpen, animalEnums } = props;
    return (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Team Member</DialogTitle>
                    <DialogDescription>
                        Enter the details of the new team member below.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="role">Role *</Label>
                        <Select
                            value={newMember.role}
                            onValueChange={(value) =>
                                setNewMember({ ...newMember, role: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                {animalEnums.role.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="john.smith@labassist.com"
                            value={newMember.email}
                            onChange={(e) =>
                                setNewMember({ ...newMember, email: e.target.value })
                            }
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={handleAddMember}
                        disabled={
                            !newMember.role ||
                            !newMember.email
                        }
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Member
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}