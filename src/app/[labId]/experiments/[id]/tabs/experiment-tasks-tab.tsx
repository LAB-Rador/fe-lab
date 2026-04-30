"use client"

import { Check, Edit, Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { TabsContent } from "@/src/components/ui/tabs"
import { Card, CardContent } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { TaskStatus } from "../../../tasks/types"
import type { Experiment } from "../../types"

export interface ExperimentTasksTabProps {
  experiment: Experiment
}

export function ExperimentTasksTab(props: ExperimentTasksTabProps) {
  const { experiment } = props

  return (
    <TabsContent value="tasks" className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Experiment Tasks</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Task</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experiment?.tasks?.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>{task.assignedTo?.firstName} {task.assignedTo?.lastName}</TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {task.status === TaskStatus.COMPLETED && <Check className="h-4 w-4 text-green-500" />}
                      <span
                        className={
                          task.status === TaskStatus.COMPLETED
                            ? "text-green-600"
                            : task.status === TaskStatus.IN_PROGRESS
                              ? "text-blue-600"
                              : "text-gray-500"
                        }
                      >
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TabsContent>
  )
}
