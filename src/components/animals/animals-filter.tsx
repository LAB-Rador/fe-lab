import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Checkbox } from "@/src/components/ui/checkbox"
import { Label } from "@/src/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group"
import { Separator } from "@/src/components/ui/separator"
import { Filter, RotateCcw } from "lucide-react"

export function AnimalsFilter() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Filters</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <RotateCcw className="h-4 w-4" />
            <span className="sr-only">Reset filters</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Species</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="mice" />
              <Label htmlFor="mice">Mice</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="rats" />
              <Label htmlFor="rats">Rats</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="birds" />
              <Label htmlFor="birds">Birds</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="fish" />
              <Label htmlFor="fish">Fish</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="other" />
              <Label htmlFor="other">Other</Label>
            </div>
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Status</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="healthy" />
              <Label htmlFor="healthy">Healthy</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="observation" />
              <Label htmlFor="observation">Under Observation</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="critical" />
              <Label htmlFor="critical">Critical</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="experiment" />
              <Label htmlFor="experiment">In Experiment</Label>
            </div>
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Sex</h3>
          <RadioGroup defaultValue="all">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
          </RadioGroup>
        </div>
        <Separator />
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Age</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="juvenile" />
              <Label htmlFor="juvenile">Juvenile (0-3 months)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="young-adult" />
              <Label htmlFor="young-adult">Young Adult (3-6 months)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="adult" />
              <Label htmlFor="adult">Adult (6-12 months)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="senior" />
              <Label htmlFor="senior">Senior (12+ months)</Label>
            </div>
          </div>
        </div>
        <Button className="w-full">
          <Filter className="mr-1 h-4 w-4" />
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  )
}
