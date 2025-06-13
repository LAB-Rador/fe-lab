import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { FileText, BarChart2, PieChart, LineChart, Users, Calendar, Clock, Star } from "lucide-react"

const reportTemplates = [
    {
        id: 1,
        title: "Animal Health Status",
        description: "Overview of health metrics for all laboratory animals",
        icon: <Users className="h-5 w-5 text-primary" />,
        lastRun: "2 days ago",
        popular: true,
    },
    {
        id: 2,
        title: "Experiment Progress",
        description: "Track the progress of ongoing experiments",
        icon: <LineChart className="h-5 w-5 text-primary" />,
        lastRun: "1 week ago",
        popular: true,
    },
    {
        id: 3,
        title: "Resource Utilization",
        description: "Analysis of laboratory resources and equipment usage",
        icon: <PieChart className="h-5 w-5 text-primary" />,
        lastRun: "3 days ago",
        popular: false,
    },
    {
        id: 4,
        title: "Task Completion",
        description: "Summary of completed and pending tasks",
        icon: <Calendar className="h-5 w-5 text-primary" />,
        lastRun: "Yesterday",
        popular: true,
    },
    {
        id: 5,
        title: "Inventory Status",
        description: "Current inventory levels and reorder recommendations",
        icon: <BarChart2 className="h-5 w-5 text-primary" />,
        lastRun: "4 days ago",
        popular: false,
    },
    {
        id: 6,
        title: "Staff Performance",
        description: "Metrics on staff productivity and task completion",
        icon: <Users className="h-5 w-5 text-primary" />,
        lastRun: "1 month ago",
        popular: false,
    },
]

export default function ReportTemplates() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTemplates.map((template) => (
                <Card key={template.id}>
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-lg flex items-center gap-2">
                                {template.icon}
                                {template.title}
                            </CardTitle>
                            <CardDescription>{template.description}</CardDescription>
                        </div>
                        {template.popular && (
                        <Badge className="bg-status-purple">
                            <Star className="h-3 w-3 mr-1" /> Popular
                        </Badge>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-gray-500 flex items-center">
                            <Clock className="h-4 w-4 mr-1" /> Last run: {template.lastRun}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" /> Preview
                        </Button>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                            Generate Report
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
