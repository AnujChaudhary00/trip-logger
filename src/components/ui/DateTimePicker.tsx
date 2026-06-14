'use client'

import { useState } from 'react'
import { Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface DateTimePickerProps {
  id?: string
  value: string
  onChange: (value: string) => void
  'aria-describedby'?: string
}

function formatDisplay(value: string): string {
  if (!value) return 'Select date & time'
  const d = new Date(value)
  if (isNaN(d.getTime())) return 'Select date & time'
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export function DateTimePicker({
  id,
  value,
  onChange,
  'aria-describedby': ariaDescribedBy,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false)
  const [draftDate, setDraftDate] = useState('')
  const [draftTime, setDraftTime] = useState('')

  function handleOpen() {
    setDraftDate(value ? value.split('T')[0] : '')
    setDraftTime(value ? (value.split('T')[1]?.slice(0, 5) ?? '') : '')
    setOpen(true)
  }

  function handleDone() {
    if (draftDate && draftTime) {
      onChange(`${draftDate}T${draftTime}`)
    }
    setOpen(false)
  }

  const canConfirm = draftDate !== '' && draftTime !== ''

  return (
    <>
      <button
        id={id}
        type="button"
        aria-describedby={ariaDescribedBy}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={handleOpen}
        className={cn(
          'flex h-10 w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-left',
          'hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-offset-background',
          !value && 'text-muted-foreground'
        )}
      >
        <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="flex-1 truncate">{formatDisplay(value)}</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Select Date &amp; Time</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-1">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-sm font-medium">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                Date
              </label>
              <input
                type="date"
                value={draftDate}
                onChange={e => setDraftDate(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-sm font-medium">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                Time
              </label>
              <input
                type="time"
                value={draftTime}
                onChange={e => setDraftTime(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" disabled={!canConfirm} onClick={handleDone}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
