import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const tasks = [
    {
        id: 1,
        name: "Mouse colony health check",
        priority: "High",
        dueDate: "2025-06-05",
        status: "In Progress",
        assignee: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AJ",
        },
    },
    {
        id: 2,
        name: "Fish tank water quality test",
        priority: "Medium",
        dueDate: "2025-06-07",
        status: "Not Started",
        assignee: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SC",
        },
    },
    {
        id: 3,
        name: "Bird feeding schedule update",
        priority: "Low",
        dueDate: "2025-06-10",
        status: "Completed",
        assignee: {
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MB",
        },
    },
    {
        id: 4,
        name: "Laboratory equipment maintenance",
        priority: "High",
        dueDate: "2025-06-03",
        status: "Overdue",
        assignee: {
        name: "Emily Wilson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "EW",
        },
    },
    {
        id: 5,
        name: "Experiment data collection",
        priority: "Medium",
        dueDate: "2025-06-08",
        status: "In Progress",
        assignee: {
        name: "David Lee",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "DL",
        },
    },
    {
        id: 6,
        name: "Inventory restocking",
        priority: "Medium",
        dueDate: "2025-06-12",
        status: "Not Started",
        assignee: {
        name: "Lisa Garcia",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "LG",
        },
    },
    {
        id: 7,
        name: "Animal welfare assessment",
        priority: "High",
        dueDate: "2025-06-04",
        status: "In Progress",
        assignee: {
        name: "Robert Kim",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "RK",
        },
    },
]

export default function TasksList() {
    return (
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead className="w-[50px]"></TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {tasks.map((task) => (
            <TableRow key={task.id}>
                <TableCell>
                <Checkbox id={`task-${task.id}`} />
                </TableCell>
                <TableCell className="font-medium">{task.name}</TableCell>
                <TableCell>
                <PriorityBadge priority={task.priority} />
                </TableCell>
                <TableCell>{formatDate(task.dueDate)}</TableCell>
                <TableCell>
                <StatusBadge status={task.status} />
                </TableCell>
                <TableCell>
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                    <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                    <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{task.assignee.name}</span>
                </div>
                </TableCell>
                <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                    <MoreHorizontal className="h-5 w-5 text-gray-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Reassign</DropdownMenuItem>
                    <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    )
}

function PriorityBadge({ priority }: { priority: string }) {
    const colorMap = {
        High: "bg-status-red/10 text-status-red border-status-red/20",
        Medium: "bg-status-yellow/10 text-status-yellow border-status-yellow/20",
        Low: "bg-status-green/10 text-status-green border-status-green/20",
    }

    return (
        <Badge variant="outline" className={`${colorMap[priority as keyof typeof colorMap]}`}>
        {priority}
        </Badge>
    )
}

function StatusBadge({ status }: { status: string }) {
    const colorMap = {
        Completed: "bg-status-green/10 text-status-green border-status-green/20",
        "In Progress": "bg-status-yellow/10 text-status-yellow border-status-yellow/20",
        "Not Started": "bg-status-purple/10 text-status-purple border-status-purple/20",
        Overdue: "bg-status-red/10 text-status-red border-status-red/20",
    }

    return (
        <Badge variant="outline" className={`${colorMap[status as keyof typeof colorMap]}`}>
        {status}
        </Badge>
    )
}

function formatDate(dateString: string) {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date)
}
