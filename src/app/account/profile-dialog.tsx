import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import type { ProfileDraft } from "./types"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"

interface ProfileDialogProps {
    setProfileDraft: (draft: ProfileDraft) => void
    setProfileOpen: (open: boolean) => void
    handleSaveProfile: () => void
    profileDraft: ProfileDraft
    profileSaving: boolean
    profileError: string
    profileOpen: boolean
}

export function ProfileDialog({
    setProfileDraft,
    setProfileOpen,
    handleSaveProfile,
    profileDraft,
    profileSaving,
    profileError,
    profileOpen,
}: ProfileDialogProps) {
    const setField = (field: keyof ProfileDraft, value: string) => {
        setProfileDraft({ ...profileDraft, [field]: value })
    }

    return (
        <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>Your profile</DialogTitle>
                    <DialogDescription>
                        Your name is shown to the laboratory. Institution, phone, and address stay on your account.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="firstName">First name *</Label>
                            <Input
                                id="firstName"
                                value={profileDraft.firstName}
                                onChange={(event) => setField("firstName", event.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lastName">Last name</Label>
                            <Input
                                id="lastName"
                                value={profileDraft.lastName}
                                onChange={(event) => setField("lastName", event.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="institution">Institution</Label>
                        <Input
                            id="institution"
                            value={profileDraft.institution}
                            onChange={(event) => setField("institution", event.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="contactPhone">Phone</Label>
                        <Input
                            id="contactPhone"
                            type="tel"
                            value={profileDraft.contactPhone}
                            onChange={(event) => setField("contactPhone", event.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            value={profileDraft.address}
                            onChange={(event) => setField("address", event.target.value)}
                        />
                    </div>
                    {profileError ? <p className="text-sm text-red-600">{profileError}</p> : null}
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setProfileOpen(false)} disabled={profileSaving}>
                        Cancel
                    </Button>
                    <Button type="button" className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveProfile} disabled={profileSaving}>
                        {profileSaving ? "Saving..." : "Save profile"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
