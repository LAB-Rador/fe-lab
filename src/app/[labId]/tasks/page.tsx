import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Calendar, Plus, Filter, ChevronDown } from "lucide-react"
import TasksCalendarView from "@/src/components/tasks/calendar-view"
import TasksList from "@/src/components/tasks/tasks-list"
import TasksNotifications from "@/src/components/tasks/notifications"

export default function TasksPage() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
                <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> New Task
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                    <Tabs defaultValue="list" className="w-full">
                        <div className="flex justify-between items-center mb-4">
                        <TabsList>
                            <TabsTrigger value="list">List View</TabsTrigger>
                            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                        </TabsList>

                        <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Filter
                            <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                            Status
                            <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                            Priority
                            <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                        </div>

                        <TabsContent value="list" className="mt-0">
                        <Card>
                            <CardContent className="p-0">
                            <TasksList />
                            </CardContent>
                        </Card>
                        </TabsContent>

                        <TabsContent value="calendar" className="mt-0">
                        <Card>
                            <CardHeader className="pb-0">
                            <CardTitle className="text-lg flex items-center">
                                <Calendar className="mr-2 h-5 w-5" />
                                June 2025
                            </CardTitle>
                            </CardHeader>
                            <CardContent>
                            <TasksCalendarView />
                            </CardContent>
                        </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                        <CardTitle className="text-lg">Notifications</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <TasksNotifications />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
