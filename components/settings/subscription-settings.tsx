import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Check, CreditCard, Download } from "lucide-react"

export function SubscriptionSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Subscription Management</CardTitle>
                <CardDescription>Manage your subscription plan and billing information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-2" style={{ borderColor: "#2563EB" }}>
                        <CardHeader className="pb-2">
                            <CardTitle>
                                <div className="flex items-center justify-between">
                                    <span>Professional Plan</span>
                                    <Badge className="bg-[#2563EB]">Current</Badge>
                                </div>
                            </CardTitle>
                            <CardDescription>
                                <div className="flex items-end gap-1 mt-2">
                                    <span className="text-2xl font-bold">$199</span>
                                    <span className="text-muted-foreground">/month</span>
                                </div>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="space-y-2 mt-4">
                                <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-[#10B981]" />
                                    <span className="text-sm">Up to 25 users</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-[#10B981]" />
                                    <span className="text-sm">Up to 5,000 animals</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-[#10B981]" />
                                    <span className="text-sm">Advanced breeding management</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-[#10B981]" />
                                    <span className="text-sm">Data export & API access</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-[#10B981]" />
                                    <span className="text-sm">Email & phone support</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant="outline">
                                Current Plan
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                        <CardTitle>Basic Plan</CardTitle>
                        <CardDescription>
                            <div className="flex items-end gap-1 mt-2">
                            <span className="text-2xl font-bold">$99</span>
                            <span className="text-muted-foreground">/month</span>
                            </div>
                        </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                        <div className="space-y-2 mt-4">
                            <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-[#10B981]" />
                            <span className="text-sm">Up to 10 users</span>
                            </div>
                            <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-[#10B981]" />
                            <span className="text-sm">Up to 1,000 animals</span>
                            </div>
                            <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-[#10B981]" />
                            <span className="text-sm">Basic breeding management</span>
                            </div>
                            <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-[#10B981]" />
                            <span className="text-sm">Data export</span>
                            </div>
                            <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-[#10B981]" />
                            <span className="text-sm">Email support</span>
                            </div>
                        </div>
                        </CardContent>
                        <CardFooter>
                        <Button className="w-full" variant="outline">
                            Downgrade
                        </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                        <CardTitle>Enterprise Plan</CardTitle>
                        <CardDescription>
                            <div className="flex items-end gap-1 mt-2">
                            <span className="text-2xl font-bold">$499</span>
                            <span className="text-muted-foreground">/month</span>
                            </div>
                        </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                        <div className="space-y-2 mt-4">
                            <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-[#10B981]" />
                            <span className="text-sm">Unlimited users</span>
                            </div>
                            <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-[#10B981]" />
                            <span className="text-sm">Unlimited animals</span>
                            </div>
                            <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-[#10B981]" />
                            <span className="text-sm">Advanced analytics</span>
                            </div>
                            <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-[#10B981]" />
                            <span className="text-sm">Custom integrations</span>
                            </div>
                            <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-[#10B981]" />
                            <span className="text-sm">24/7 priority support</span>
                            </div>
                        </div>
                        </CardContent>
                        <CardFooter>
                        <Button className="w-full" style={{ backgroundColor: "#2563EB" }}>
                            Upgrade
                        </Button>
                        </CardFooter>
                    </Card>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                    <h3 className="font-medium">Current Usage</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label>Users (18 of 25)</Label>
                            <span className="text-sm text-muted-foreground">72%</span>
                        </div>
                        <Progress value={72} className="h-2" />
                        </div>
                        <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label>Animals (3,245 of 5,000)</Label>
                            <span className="text-sm text-muted-foreground">65%</span>
                        </div>
                        <Progress value={65} className="h-2" />
                        </div>
                        <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label>Storage (15GB of 50GB)</Label>
                            <span className="text-sm text-muted-foreground">30%</span>
                        </div>
                        <Progress value={30} className="h-2" />
                        </div>
                        <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label>API Calls (45,678 of 100,000)</Label>
                            <span className="text-sm text-muted-foreground">46%</span>
                        </div>
                        <Progress value={46} className="h-2" />
                        </div>
                    </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-medium">Billing History</h3>
                        <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export All
                        </Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">INV-001-2023</TableCell>
                                <TableCell>May 1, 2023</TableCell>
                                <TableCell>$199.00</TableCell>
                                <TableCell>
                                    <Badge className="bg-[#10B981]">Paid</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">INV-002-2023</TableCell>
                                <TableCell>June 1, 2023</TableCell>
                                <TableCell>$199.00</TableCell>
                                <TableCell>
                                    <Badge className="bg-[#10B981]">Paid</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">INV-003-2023</TableCell>
                                <TableCell>July 1, 2023</TableCell>
                                <TableCell>$199.00</TableCell>
                                <TableCell>
                                    <Badge className="bg-[#10B981]">Paid</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">INV-004-2023</TableCell>
                                <TableCell>August 1, 2023</TableCell>
                                <TableCell>$199.00</TableCell>
                                <TableCell>
                                    <Badge className="bg-[#10B981]">Paid</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                    <h3 className="font-medium">Payment Method</h3>
                <div className="flex items-center gap-4 p-4 border rounded-md">
                    <CreditCard className="h-6 w-6" />
                    <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-auto">
                        Update
                    </Button>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-md">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="auto-renew">Auto-renew subscription</Label>
                        <Switch id="auto-renew" defaultChecked />
                    </div>
                </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" className="gap-2 text-[#EF4444]">
                    <AlertCircle className="h-4 w-4" />
                    Cancel Subscription
                </Button>
                <Button style={{ backgroundColor: "#2563EB" }}>Save Changes</Button>
            </CardFooter>
        </Card>
    )
}
