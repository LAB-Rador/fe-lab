import type React from "react"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                {description && <p className="text-muted-foreground">{description}</p>}
            </div>
            {action || (
                <Button variant="outline" className="gap-2">
                    <Save className="h-4 w-4" />
                    Save All Changes
                </Button>
            )}
        </div>
    )
}
