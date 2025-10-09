"use client"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Sex, AnimalStatus, type CreateAnimalData, type AnimalType } from "./types"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { Calendar } from "@/src/components/ui/calendar"
import { Textarea } from "@/src/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/src/components/ui/button"
import { CalendarIcon, Plus } from "lucide-react"
import { Input } from "@/src/components/ui/input"
import { useForm } from "react-hook-form"
import { cn } from "@/src/lib/utils"
import { format } from "date-fns"
import { useState } from "react"
import type React from "react"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/src/components/ui/dialog'
import type { AnimalEnums } from "@/src/app/[labId]/animals/types"

const formSchema = z.object({
    identifier: z.string().min(1, "Identifier is required").max(50, "Identifier must be less than 50 characters"),
    name: z.string().optional(),
    animalTypeId: z.string().min(1, "Animal type is required"),
    laboratoryId: z.string().min(1, "Laboratory is required"),
    birthDate: z.date().optional(),
    acquisitionDate: z.date().optional(),
    sex: z.nativeEnum(Sex).optional(),
    strain: z.string().optional(),
    genotype: z.string().optional(),
    status: z.nativeEnum(AnimalStatus).optional(),
    location: z.string().optional(),
    origin: z.string().optional(),
})

interface AddAnimalDialogProps {
    onAddAnimalType: (typeName: string) => Promise<string>
    onSubmit: (data: CreateAnimalData) => Promise<void>
    setOpen: (open: boolean) => void
    loadingButtonText: string
    animalTypes: AnimalType[]
    trigger?: React.ReactNode
    animalEnums: AnimalEnums
    submitButtonText: string
    userId: string
    labId: string
    open: boolean
}

export function AddAnimalDialog({ 
    loadingButtonText,
    submitButtonText,
    onAddAnimalType,
    animalTypes,
    animalEnums,
    onSubmit, 
    setOpen,
    labId,
    open,
}: AddAnimalDialogProps) {
    const [isCreatingType, setIsCreatingType] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [newTypeValue, setNewTypeValue] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        laboratoryId: labId,
        status: undefined,
        animalTypeId: "",
        identifier: "",
        sex: undefined,
        location: "",
        genotype: "",
        strain: "",
        origin: "",
        name: "",
    },
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      await onSubmit({
        ...values,
        acquisitionDate: values.acquisitionDate || new Date(),
        status: values.status || AnimalStatus.ACTIVE,
      })
      form.reset()
      setOpen(false)
    } catch (error) {
      console.error("Error adding animal:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateNewType = async () => {
    if (!newTypeValue.trim()) return

    setIsCreatingType(true)
    try {
      await onAddAnimalType(newTypeValue)
      
      setNewTypeValue("")
      setIsCreatingType(false)
    } catch (error) {
      console.error("Error creating animal type:", error)
    } finally {
      setIsCreatingType(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      </DialogTrigger>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto" 
        id="add-animal-dialog"
        onInteractOutside={(e) => {
          // Предотвращаем закрытие диалога при клике на Select dropdown
          const target = e.target as Element
          if (target && target.closest('[data-radix-select-content]')) {
            e.preventDefault()
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Add New Animal</DialogTitle>
          <DialogDescription>
            Enter the details for the new animal. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Identifier */}
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identifier *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., M001, F-2024-001" {...field} />
                    </FormControl>
                    <FormDescription>Unique identifier for this animal</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional animal name" {...field} />
                    </FormControl>
                    <FormDescription>Optional friendly name for the animal</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Animal Type */}
              <FormField
                control={form.control}
                name="animalTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Animal Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select animal type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {animalTypes.length === 0 ? (
                          <div className="p-2 text-center text-sm text-gray-500">
                            No animal types found
                          </div>
                        ) : (
                          animalTypes.map((type) => (
                            <SelectItem key={type.name} value={type.id || "null"}>
                              {type.name}
                            </SelectItem>
                          ))
                        )}
                        <div className="border-t p-2 space-y-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder="New animal type"
                              value={newTypeValue}
                              onChange={(e) => setNewTypeValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault()
                                  handleCreateNewType()
                                }
                              }}
                              disabled={isCreatingType}
                            />
                            <Button
                              type="button"
                              size="sm"
                              onClick={handleCreateNewType}
                              disabled={!newTypeValue.trim() || isCreatingType}
                              className="px-3"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </SelectContent>
                    </Select>
                    <FormDescription>Type and species of the animal</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sex */}
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sex</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sex" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {animalEnums.sex.map((sex) => (
                          <SelectItem key={sex} value={sex}>
                            {sex}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Biological sex of the animal</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {animalEnums.status.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Current status of the animal</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Strain */}
              <FormField
                control={form.control}
                name="strain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Strain</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., C57BL/6J, BALB/c" {...field} />
                    </FormControl>
                    <FormDescription>Genetic strain or breed of the animal</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Birth Date */}
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Birth Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                          captionLayout="dropdown"
                          showOutsideDays={false}
                          className="rounded-md border"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Date when the animal was born</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Acquisition Date */}
              <FormField
                control={form.control}
                name="acquisitionDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Acquisition Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date (defaults to today)</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 relative z-50" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                          captionLayout="dropdown"
                          showOutsideDays={false}
                          className="rounded-md border"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Date when the animal was acquired by the laboratory</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Room 101, Cage A-15" {...field} />
                    </FormControl>
                    <FormDescription>Current physical location of the animal</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Origin */}
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origin</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jackson Laboratory, Internal Breeding" {...field} />
                    </FormControl>
                    <FormDescription>Source or origin of the animal</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Genotype - Full width */}
            <FormField
              control={form.control}
              name="genotype"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genotype</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Tg(Thy1-YFP)HJrs/J, +/+, heterozygous for mutation X"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Genetic makeup or genotype information</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} style={{ backgroundColor: "#2563EB" }}>
                {isSubmitting ? `${loadingButtonText}...` : submitButtonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
