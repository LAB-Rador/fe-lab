import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, Trash } from "lucide-react"

export function BreedingProtocolsSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Breeding Protocol Configuration</CardTitle>
                <CardDescription>Configure breeding protocols and tracking parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h3 className="font-medium">Active Breeding Protocols</h3>
                    <p className="text-sm text-muted-foreground">Manage breeding protocols for different animal types</p>
                </div>
                <Button className="gap-2" style={{ backgroundColor: "#2563EB" }}>
                    <Plus className="h-4 w-4" />
                    Add Protocol
                </Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Protocol Name</TableHead>
                        <TableHead>Animal Type</TableHead>
                        <TableHead>Approval Status</TableHead>
                        <TableHead>Expiration Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                        <TableCell className="font-medium">Standard Mouse Breeding</TableCell>
                        <TableCell>Laboratory Mouse</TableCell>
                        <TableCell>
                            <Badge className="bg-[#10B981]">Approved</Badge>
                        </TableCell>
                        <TableCell>2024-06-30</TableCell>
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
                        <TableCell className="font-medium">Transgenic Line Maintenance</TableCell>
                        <TableCell>Laboratory Mouse</TableCell>
                        <TableCell>
                            <Badge className="bg-[#10B981]">Approved</Badge>
                        </TableCell>
                        <TableCell>2024-05-15</TableCell>
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
                        <TableCell className="font-medium">Zebrafish Colony Expansion</TableCell>
                        <TableCell>Zebrafish</TableCell>
                        <TableCell>
                            <Badge className="bg-[#F59E0B]">Pending Review</Badge>
                        </TableCell>
                        <TableCell>N/A</TableCell>
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
                        <TableCell className="font-medium">Finch Behavioral Study</TableCell>
                        <TableCell>Zebra Finch</TableCell>
                        <TableCell>
                            <Badge className="bg-[#10B981]">Approved</Badge>
                        </TableCell>
                        <TableCell>2024-08-22</TableCell>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                    <CardTitle>Protocol Parameters</CardTitle>
                    <CardDescription>Configure default parameters for breeding protocols</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Minimum Breeding Age</Label>
                        <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs">Laboratory Mouse</Label>
                            <div className="flex items-center">
                            <Input type="number" defaultValue="6" className="rounded-r-none" />
                            <div className="bg-muted px-3 py-2 border border-l-0 rounded-r-md text-sm">weeks</div>
                            </div>
                        </div>
                        <div>
                            <Label className="text-xs">Zebra Finch</Label>
                            <div className="flex items-center">
                            <Input type="number" defaultValue="90" className="rounded-r-none" />
                            <div className="bg-muted px-3 py-2 border border-l-0 rounded-r-md text-sm">days</div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Maximum Breeding Age</Label>
                        <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs">Laboratory Mouse</Label>
                            <div className="flex items-center">
                            <Input type="number" defaultValue="12" className="rounded-r-none" />
                            <div className="bg-muted px-3 py-2 border border-l-0 rounded-r-md text-sm">months</div>
                            </div>
                        </div>
                        <div>
                            <Label className="text-xs">Zebra Finch</Label>
                            <div className="flex items-center">
                            <Input type="number" defaultValue="4" className="rounded-r-none" />
                            <div className="bg-muted px-3 py-2 border border-l-0 rounded-r-md text-sm">years</div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Minimum Rest Period Between Litters</Label>
                        <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs">Laboratory Mouse</Label>
                            <div className="flex items-center">
                            <Input type="number" defaultValue="21" className="rounded-r-none" />
                            <div className="bg-muted px-3 py-2 border border-l-0 rounded-r-md text-sm">days</div>
                            </div>
                        </div>
                        <div>
                            <Label className="text-xs">Zebra Finch</Label>
                            <div className="flex items-center">
                            <Input type="number" defaultValue="30" className="rounded-r-none" />
                            <div className="bg-muted px-3 py-2 border border-l-0 rounded-r-md text-sm">days</div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Maximum Litters Per Female</Label>
                        <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs">Laboratory Mouse</Label>
                            <Input type="number" defaultValue="6" />
                        </div>
                        <div>
                            <Label className="text-xs">Zebra Finch</Label>
                            <Input type="number" defaultValue="8" />
                        </div>
                        </div>
                    </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                    <CardTitle>Breeding Alerts</CardTitle>
                    <CardDescription>Configure alerts and notifications for breeding events</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                        <Label>Expected Birth Reminder</Label>
                        <p className="text-sm text-muted-foreground">Alert before expected birth/hatching date</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center">
                        <Input type="number" defaultValue="2" className="w-16 mr-2" />
                        <Label>days before expected date</Label>
                    </div>

                    <Separator className="my-2" />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                        <Label>Weaning Reminder</Label>
                        <p className="text-sm text-muted-foreground">Alert when offspring reach weaning age</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center">
                        <Input type="number" defaultValue="21" className="w-16 mr-2" />
                        <Label>days after birth (mice)</Label>
                    </div>

                    <Separator className="my-2" />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                        <Label>Breeding Pair Separation</Label>
                        <p className="text-sm text-muted-foreground">Alert when breeding pairs should be separated</p>
                        </div>
                        <Switch defaultChecked />
                    </div>

                    <Separator className="my-2" />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                        <Label>Maximum Age Alert</Label>
                        <p className="text-sm text-muted-foreground">Alert when breeders reach maximum breeding age</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    </CardContent>
                </Card>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline">Reset to Defaults</Button>
                <Button style={{ backgroundColor: "#2563EB" }}>Save Changes</Button>
            </CardFooter>
        </Card>
    )
}
