import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Switch } from "@/src/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { Edit, Plus, Trash } from "lucide-react"

export function AnimalTypesSettings() {
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                <CardTitle>Animal Types Management</CardTitle>
                <CardDescription>Configure the types of animals monitored in your laboratory</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                        <h3 className="font-medium">Active Animal Types</h3>
                        <p className="text-sm text-muted-foreground">Manage the animal types currently being monitored</p>
                        </div>
                        <Button className="gap-2" style={{ backgroundColor: "#2563EB" }}>
                        <Plus className="h-4 w-4" />
                        Add Animal Type
                        </Button>
                    </div>

                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Animal Type</TableHead>
                            <TableHead>Species</TableHead>
                            <TableHead>Active Colonies</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">Laboratory Mouse</TableCell>
                            <TableCell>Mus musculus</TableCell>
                            <TableCell>12</TableCell>
                            <TableCell>
                            <Badge className="bg-[#10B981]">Active</Badge>
                            </TableCell>
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
                            <TableCell className="font-medium">Zebra Finch</TableCell>
                            <TableCell>Taeniopygia guttata</TableCell>
                            <TableCell>5</TableCell>
                            <TableCell>
                            <Badge className="bg-[#10B981]">Active</Badge>
                            </TableCell>
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
                            <TableCell className="font-medium">Zebrafish</TableCell>
                            <TableCell>Danio rerio</TableCell>
                            <TableCell>8</TableCell>
                            <TableCell>
                            <Badge className="bg-[#F59E0B]">Maintenance</Badge>
                            </TableCell>
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
                            <TableCell className="font-medium">Fruit Fly</TableCell>
                            <TableCell>Drosophila melanogaster</TableCell>
                            <TableCell>15</TableCell>
                            <TableCell>
                            <Badge className="bg-[#10B981]">Active</Badge>
                            </TableCell>
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
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline">Reset to Defaults</Button>
                <Button style={{ backgroundColor: "#2563EB" }}>Save Changes</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>Animal Attributes</CardTitle>
                <CardDescription>Configure custom attributes for tracking animal data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Attribute Name</Label>
                            <Input placeholder="e.g., Genetic Modification" />
                        </div>
                        <div className="space-y-2">
                            <Label>Data Type</Label>
                            <Select defaultValue="text">
                            <SelectTrigger>
                                <SelectValue placeholder="Select data type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="date">Date</SelectItem>
                                <SelectItem value="boolean">Yes/No</SelectItem>
                                <SelectItem value="select">Selection</SelectItem>
                            </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Applicable Animal Types</Label>
                            <Select defaultValue="all">
                            <SelectTrigger>
                                <SelectValue placeholder="Select animal types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="mouse">Laboratory Mouse</SelectItem>
                                <SelectItem value="finch">Zebra Finch</SelectItem>
                                <SelectItem value="zebrafish">Zebrafish</SelectItem>
                                <SelectItem value="fruitfly">Fruit Fly</SelectItem>
                            </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="required" />
                            <Label htmlFor="required">Required Field</Label>
                        </div>
                        <Button style={{ backgroundColor: "#2563EB" }}>Add Attribute</Button>
                        </div>

                        <div className="border rounded-md p-4">
                        <h3 className="font-medium mb-4">Current Custom Attributes</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                            <div>
                                <p className="font-medium">Genetic Modification</p>
                                <p className="text-sm text-muted-foreground">Text • All Types</p>
                            </div>
                            <Button variant="ghost" size="icon">
                                <Trash className="h-4 w-4" />
                            </Button>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                            <div>
                                <p className="font-medium">Age (weeks)</p>
                                <p className="text-sm text-muted-foreground">Number • All Types</p>
                            </div>
                            <Button variant="ghost" size="icon">
                                <Trash className="h-4 w-4" />
                            </Button>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                            <div>
                                <p className="font-medium">Treatment Group</p>
                                <p className="text-sm text-muted-foreground">Selection • Mouse, Zebrafish</p>
                            </div>
                            <Button variant="ghost" size="icon">
                                <Trash className="h-4 w-4" />
                            </Button>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                            <div>
                                <p className="font-medium">Breeding Restricted</p>
                                <p className="text-sm text-muted-foreground">Yes/No • All Types</p>
                            </div>
                            <Button variant="ghost" size="icon">
                                <Trash className="h-4 w-4" />
                            </Button>
                            </div>
                        </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
