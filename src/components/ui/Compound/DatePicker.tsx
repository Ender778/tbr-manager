'use client'

import React, { useState } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import * as Popover from '@radix-ui/react-popover'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  date?: Date | null
  onDateChange: (date: Date | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  label?: string
  tooltip?: string
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = 'Pick a date',
  disabled = false,
  className,
  label,
  tooltip,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
          {label}
          {tooltip && (
            <span
              className="text-xs text-gray-500 font-normal cursor-help"
              title={tooltip}
            >
              ⓘ
            </span>
          )}
        </label>
      )}
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              'w-full flex items-center justify-start gap-2 px-3 py-2',
              'text-sm text-left font-normal',
              'bg-white border border-gray-300 rounded-md',
              'hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent',
              'disabled:bg-gray-50 disabled:cursor-not-allowed',
              !date && 'text-gray-500'
            )}
          >
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            {date && !isNaN(date.getTime()) ? format(date, 'MMM d, yyyy') : <span>{placeholder}</span>}
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="z-50 w-auto bg-white rounded-lg shadow-xl border border-gray-200 p-3"
            align="start"
            sideOffset={8}
          >
            <div style={{ width: '320px' }}>
              <DayPicker
                mode="single"
                selected={date || undefined}
                onSelect={(selectedDate) => {
                  onDateChange(selectedDate || null)
                  setOpen(false)
                }}
                disabled={disabled}
                showOutsideDays={false}
                components={{
                  Chevron: ({ orientation }) =>
                    orientation === 'left' ? (
                      <ChevronLeft className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    ),
                }}
                classNames={{
                  month: 'w-full',
                  month_caption: 'flex justify-center items-center pt-2 pb-3 mb-2 relative h-12',
                  caption_label: 'text-sm font-semibold text-gray-900 whitespace-nowrap pointer-events-none z-0',
                  nav: 'absolute inset-x-0 top-0 h-12 flex justify-between items-center pt-3 z-10',
                  button_previous:
                    'h-10 w-10 bg-transparent p-0 hover:bg-gray-100 rounded-md inline-flex items-center justify-center disabled:opacity-50 transition-colors cursor-pointer',
                  button_next:
                    'h-10 w-10 bg-transparent p-0 hover:bg-gray-100 rounded-md inline-flex items-center justify-center disabled:opacity-50 transition-colors cursor-pointer',
                  month_grid: 'w-full border-collapse',
                  weekdays: 'flex',
                  weekday: 'text-gray-500 rounded-md w-10 font-normal text-xs text-center',
                  week: 'flex w-full mt-2',
                  day: 'h-10 w-10 text-center text-sm p-0 relative hover:bg-gray-100 rounded-md transition-colors focus-within:relative focus-within:z-20',
                  day_button:
                    'h-10 w-10 p-0 font-normal aria-selected:opacity-100 inline-flex items-center justify-center',
                  selected:
                    'bg-amber-500 text-white hover:bg-amber-600 hover:text-white focus:bg-amber-600 focus:text-white font-semibold',
                  today: 'bg-gray-100 text-gray-900 font-semibold',
                  outside: 'text-gray-400 opacity-50',
                  disabled: 'text-gray-400 opacity-50 cursor-not-allowed hover:bg-transparent',
                  hidden: 'invisible',
                }}
              />
            </div>
            {date && (
              <div className="border-t border-gray-200 mt-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onDateChange(null)
                    setOpen(false)
                  }}
                  className="w-full text-xs text-red-600 hover:text-red-700 hover:bg-red-50 py-1.5 px-2 rounded transition-colors"
                >
                  Clear date
                </button>
              </div>
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}
