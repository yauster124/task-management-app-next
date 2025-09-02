"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerProps = {
  id?: string
  name?: string
  value?: Date
  onChange?: (date: Date | undefined) => void
}

export function DatePicker({ id, name, value, onChange }: DatePickerProps) {
  const handleSelect = (newDate: Date | undefined) => {
    onChange?.(newDate)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!value}
          className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={value} onSelect={handleSelect} />
      </PopoverContent>

      {/* hidden input so forms still work natively if needed */}
      <input
        type="hidden"
        id={id}
        name={name}
        value={value ? value.toISOString() : ""}
      />
    </Popover>
  )
}
