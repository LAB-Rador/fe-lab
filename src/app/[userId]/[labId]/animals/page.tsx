import { AnimalsHeader } from "@/src/components/animals/animals-header"
import { AnimalsFilter } from "@/src/components/animals/animals-filter"
import { AnimalsList } from "@/src/components/animals/animals-list"

export default function AnimalsPage() {
  return (
    <div className="space-y-6">
      <AnimalsHeader />
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <AnimalsFilter />
        <AnimalsList />
      </div>
    </div>
  )
}
