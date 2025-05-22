import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function NotificationSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how and when you receive system notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-medium mb-4">Notification Channels</h3>
                    <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                        <Label>In-App Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications within the application</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive urgent notifications via SMS</p>
                        </div>
                        <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                        <Label>Mobile Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive push notifications on mobile devices</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    </div>
                </div>

                <div>
                    <h3 className="font-medium mb-4">Notification Frequency</h3>
                    <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Daily Digest</Label>
                        <Select defaultValue="end-of-day">
                        <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="disabled">Disabled</SelectItem>
                            <SelectItem value="morning">Morning (8:00 AM)</SelectItem>
                            <SelectItem value="end-of-day">End of Day (5:00 PM)</SelectItem>
                        </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">Receive a summary of all notifications</p>
                    </div>
                    <div className="space-y-2">
                        <Label>Weekly Report</Label>
                        <Select defaultValue="monday">
                        <SelectTrigger>
                            <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="disabled">Disabled</SelectItem>
                            <SelectItem value="monday">Monday</SelectItem>
                            <SelectItem value="friday">Friday</SelectItem>
                            <SelectItem value="sunday">Sunday</SelectItem>
                        </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">Receive a weekly summary report</p>
                    </div>
                    </div>
                </div>
                </div>

                <Separator className="my-4" />

                <div>
                <h3 className="font-medium mb-4">Notification Types</h3>
                <div className="space-y-4">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[300px]">Event Type</TableHead>
                        <TableHead>In-App</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>SMS</TableHead>
                        <TableHead>Push</TableHead>
                        <TableHead>Priority</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                        <TableCell className="font-medium">Animal Health Alerts</TableCell>
                        <TableCell>
                            <Switch defaultChecked />
                        </TableCell>
                        <TableCell>
                            <Switch defaultChecked />
                        </TableCell>
                        <TableCell>
                            <Switch defaultChecked />
                        </TableCell>
                        <TableCell>
                            <Switch defaultChecked />
                        </TableCell>
                        <TableCell>
                            <Select defaultValue="high">
                            <SelectTrigger>
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                            </Select>
                        </TableCell>
                        </TableRow>
                        <TableRow>
                        <TableCell className="font-medium">Breeding Events</TableCell>
                        <TableCell>
                            <Switch defaultChecked />
                        </TableCell>
                        <TableCell>
                            <Switch defaultChecked />
                        </TableCell>
                        <TableCell>
                            <Switch />
                        </TableCell>
                        <TableCell>
                            <Switch defaultChecked />
                        </TableCell>
                        <TableCell>
                            <Select defaultValue="medium">
                            <SelectTrigger>
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                            </Select>
                        </TableCell>
                        </TableRow>
                        <TableRow>
                        <TableCell className="font-medium">Protocol Approvals</TableCell>
                        <TableCell>
                            <Switch defaultChecked />
                        </TableCell>
                        <TableCell>
                            <Switch defaultChecked />
                        </TableCell>
                        <TableCell>
                            <Switch />
                        </TableCell>
                        <TableCell>
                            <Switch />
                        </TableCell>
                        <TableCell>
                            <Select defaultValue="medium">
                            <SelectTrigger>
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                            </Select>
                        </TableCell>
                        </TableRow>
                        <TableRow>
                        <TableCell className="font-medium">System Maintenance</TableCell>
                        <TableCell>
                            <Switch defaultChecked />
                        </TableCell>
                        <TableCell>
                            <Switch defaultChecked />
                        </TableCell>
                        <TableCell>
                            <Switch />
                        </TableCell>
                        <TableCell>
                            <Switch />
                        </TableCell>
                        <TableCell>
                            <Select defaultValue="low">
                            <SelectTrigger>
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                            </Select>
                        </TableCell>
                        </TableRow>
                        <TableRow>
                        <TableCell className="font-medium">User Account Changes</TableCell>
                        <TableCell>
                            <Switch defaultChecked />
                        </TableCell>
                        <TableCell>
                            <Switch defaultChecked />
                        </TableCell>
                        <TableCell>
                            <Switch />
                        </TableCell>
                        <TableCell>
                            <Switch />
                        </TableCell>
                        <TableCell>
                            <Select defaultValue="medium">
                            <SelectTrigger>
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                            </Select>
                        </TableCell>
                        </TableRow>
                        <TableRow>
                        <TableCell className="font-medium">Task Assignments</TableCell>
                        <TableCell>
                            <Switch defaultChecked />
                        </TableCell>
                        <TableCell>
                            <Switch defaultChecked />
                        </TableCell>
                        <TableCell>
                            <Switch />
                        </TableCell>
                        <TableCell>
                            <Switch defaultChecked />
                        </TableCell>
                        <TableCell>
                            <Select defaultValue="medium">
                            <SelectTrigger>
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                            </Select>
                        </TableCell>
                        </TableRow>
                    </TableBody>
                    </Table>
                </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                <h3 className="font-medium">Quiet Hours</h3>
                <p className="text-sm text-muted-foreground">Set times when you don't want to receive notifications</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Select defaultValue="22:00">
                        <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="20:00">8:00 PM</SelectItem>
                        <SelectItem value="21:00">9:00 PM</SelectItem>
                        <SelectItem value="22:00">10:00 PM</SelectItem>
                        <SelectItem value="23:00">11:00 PM</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                    <div className="space-y-2">
                    <Label>End Time</Label>
                    <Select defaultValue="07:00">
                        <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="06:00">6:00 AM</SelectItem>
                        <SelectItem value="07:00">7:00 AM</SelectItem>
                        <SelectItem value="08:00">8:00 AM</SelectItem>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="override-quiet" />
                    <Label htmlFor="override-quiet">Allow high priority notifications during quiet hours</Label>
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
