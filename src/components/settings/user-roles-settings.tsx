import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Separator } from "@/src/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Check, Edit, Plus, Trash, X } from "lucide-react"

export function UserRolesSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>User Roles and Permissions</CardTitle>
                <CardDescription>Manage user access levels and permissions within the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <h3 className="font-medium">Role Management</h3>
                        <p className="text-sm text-muted-foreground">Configure user roles and their associated permissions</p>
                    </div>
                    <Button className="gap-2" style={{ backgroundColor: "#2563EB" }}>
                        <Plus className="h-4 w-4" />
                        Create New Role
                    </Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Role Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Users Assigned</TableHead>
                            <TableHead>Last Modified</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">Administrator</TableCell>
                            <TableCell>Full system access and configuration rights</TableCell>
                            <TableCell>3</TableCell>
                            <TableCell>2023-10-15</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" disabled>
                                    <Trash className="h-4 w-4" />
                                </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Lab Manager</TableCell>
                            <TableCell>Manage animals, protocols, and lab staff</TableCell>
                            <TableCell>5</TableCell>
                            <TableCell>2023-11-02</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Trash className="h-4 w-4" />
                                </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Researcher</TableCell>
                            <TableCell>View and record data for assigned animals</TableCell>
                            <TableCell>12</TableCell>
                            <TableCell>2023-09-28</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Trash className="h-4 w-4" />
                                </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Technician</TableCell>
                            <TableCell>Record daily care and maintenance activities</TableCell>
                            <TableCell>8</TableCell>
                            <TableCell>2023-10-10</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Trash className="h-4 w-4" />
                                </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Veterinarian</TableCell>
                            <TableCell>Monitor health and approve medical procedures</TableCell>
                            <TableCell>2</TableCell>
                            <TableCell>2023-11-05</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Trash className="h-4 w-4" />
                                </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <Separator className="my-4" />

                <div className="space-y-4">
                    <h3 className="font-medium">Permission Matrix</h3>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[250px]">Permission</TableHead>
                                    <TableHead>Administrator</TableHead>
                                    <TableHead>Lab Manager</TableHead>
                                    <TableHead>Researcher</TableHead>
                                    <TableHead>Technician</TableHead>
                                    <TableHead>Veterinarian</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">View Animals</TableCell>
                                    <TableCell>
                                        <Check className="h-4 w-4 text-[#10B981]" />
                                    </TableCell>
                                    <TableCell>
                                        <Check className="h-4 w-4 text-[#10B981]" />
                                    </TableCell>
                                    <TableCell>
                                        <Check className="h-4 w-4 text-[#10B981]" />
                                    </TableCell>
                                    <TableCell>
                                        <Check className="h-4 w-4 text-[#10B981]" />
                                    </TableCell>
                                    <TableCell>
                                        <Check className="h-4 w-4 text-[#10B981]" />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Add/Edit Animals</TableCell>
                                    <TableCell>
                                        <Check className="h-4 w-4 text-[#10B981]" />
                                    </TableCell>
                                    <TableCell>
                                        <Check className="h-4 w-4 text-[#10B981]" />
                                    </TableCell>
                                    <TableCell>
                                        <Check className="h-4 w-4 text-[#10B981]" />
                                    </TableCell>
                                    <TableCell>
                                        <X className="h-4 w-4 text-[#EF4444]" />
                                    </TableCell>
                                    <TableCell>
                                        <Check className="h-4 w-4 text-[#10B981]" />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Delete Animals</TableCell>
                                    <TableCell>
                                        <Check className="h-4 w-4 text-[#10B981]" />
                                    </TableCell>
                                    <TableCell>
                                        <Check className="h-4 w-4 text-[#10B981]" />
                                    </TableCell>
                                    <TableCell>
                                        <X className="h-4 w-4 text-[#EF4444]" />
                                    </TableCell>
                                    <TableCell>
                                        <X className="h-4 w-4 text-[#EF4444]" />
                                    </TableCell>
                                    <TableCell>
                                        <X className="h-4 w-4 text-[#EF4444]" />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Manage Breeding</TableCell>
                                    <TableCell>
                                        <Check className="h-4 w-4 text-[#10B981]" />
                                    </TableCell>
                                    <TableCell>
                                        <Check className="h-4 w-4 text-[#10B981]" />
                                    </TableCell>
                                    <TableCell>
                                        <Check className="h-4 w-4 text-[#10B981]" />
                                    </TableCell>
                                    <TableCell>
                                        <X className="h-4 w-4 text-[#EF4444]" />
                                    </TableCell>
                                    <TableCell>
                                        <Check className="h-4 w-4 text-[#10B981]" />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Approve Protocols</TableCell>
                                    <TableCell>
                                        <Check className="h-4 w-4 text-[#10B981]" />
                                    </TableCell>
                                    <TableCell>
                                        <Check className="h-4 w-4 text-[#10B981]" />
                                    </TableCell>
                                    <TableCell>
                                        <X className="h-4 w-4 text-[#EF4444]" />
                                    </TableCell>
                                    <TableCell>
                                        <X className="h-4 w-4 text-[#EF4444]" />
                                    </TableCell>
                                    <TableCell>
                                        <Check className="h-4 w-4 text-[#10B981]" />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Manage Users</TableCell>
                                    <TableCell>
                                        <Check className="h-4 w-4 text-[#10B981]" />
                                    </TableCell>
                                    <TableCell>
                                        <Check className="h-4 w-4 text-[#10B981]" />
                                    </TableCell>
                                    <TableCell>
                                        <X className="h-4 w-4 text-[#EF4444]" />
                                    </TableCell>
                                    <TableCell>
                                        <X className="h-4 w-4 text-[#EF4444]" />
                                    </TableCell>
                                    <TableCell>
                                        <X className="h-4 w-4 text-[#EF4444]" />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">System Configuration</TableCell>
                                    <TableCell>
                                        <Check className="h-4 w-4 text-[#10B981]" />
                                    </TableCell>
                                    <TableCell>
                                        <X className="h-4 w-4 text-[#EF4444]" />
                                    </TableCell>
                                    <TableCell>
                                        <X className="h-4 w-4 text-[#EF4444]" />
                                    </TableCell>
                                    <TableCell>
                                        <X className="h-4 w-4 text-[#EF4444]" />
                                    </TableCell>
                                    <TableCell>
                                        <X className="h-4 w-4 text-[#EF4444]" />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Export Data</TableCell>
                                    <TableCell>
                                        <Check className="h-4 w-4 text-[#10B981]" />
                                    </TableCell>
                                    <TableCell>
                                        <Check className="h-4 w-4 text-[#10B981]" />
                                    </TableCell>
                                    <TableCell>
                                        <Check className="h-4 w-4 text-[#10B981]" />
                                    </TableCell>
                                    <TableCell>
                                        <X className="h-4 w-4 text-[#EF4444]" />
                                    </TableCell>
                                    <TableCell>
                                        <Check className="h-4 w-4 text-[#10B981]" />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline">Reset to Defaults</Button>
                <Button style={{ backgroundColor: "#2563EB" }}>Save Changes</Button>
            </CardFooter>
        </Card>
    )
}
