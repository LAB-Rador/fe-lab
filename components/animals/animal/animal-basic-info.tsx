import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Ruler, Thermometer, Weight } from "lucide-react"

interface Animal {
    id: string;
    type: string;
    strain: string;
    sex: string;
    birthDate: string;
    age: string;
    weight: string;
    location: string;
}

interface AnimalBasicInfoProps {
    animal: Animal;
}

export function AnimalBasicInfo({ animal }: AnimalBasicInfoProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Type" value={animal.type} />
            <InfoItem label="Strain" value={animal.strain} />
            <InfoItem label="Sex" value={animal.sex} />
            <InfoItem label="Birth Date" value={animal.birthDate} />
            <InfoItem label="Age" value={animal.age} />
            <InfoItem label="Weight" value={animal.weight} icon={Weight} />
            <InfoItem label="Location" value={animal.location} icon={MapPin} className="md:col-span-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Physical Characteristics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoItem label="Coat Color" value="Black" />
            <InfoItem label="Length" value="10 cm" icon={Ruler} />
            <InfoItem label="Temperature" value="37.2°C" icon={Thermometer} />
            <InfoItem label="Genetic Modifications" value="GFP Expression" className="md:col-span-3" />
            <InfoItem label="Distinguishing Features" value="White spot on tail" className="md:col-span-3" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Husbandry Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Diet" value="Standard Lab Diet" />
            <InfoItem label="Feeding Schedule" value="Twice daily" />
            <InfoItem label="Housing Type" value="Individual cage" />
            <InfoItem label="Environmental Enrichment" value="Running wheel, nesting material" />
            <InfoItem label="Light Cycle" value="12h light/12h dark" />
            <InfoItem label="Temperature Range" value="20-22°C" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface InfoItemProps {
  label: string
  value: string
  icon?: React.ElementType
  className?: string
}

function InfoItem({ label, value, icon: Icon, className }: InfoItemProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-blue-600" />}
        <p className="font-medium">{value}</p>
      </div>
    </div>
  )
}
