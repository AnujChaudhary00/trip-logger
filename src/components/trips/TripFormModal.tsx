'use client'

import { useEffect } from 'react'
import { createRipple } from '@/lib/ripple'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { TripFormView } from '@/components/trips/TripFormView'
import { useTripForm } from '@/hooks/useTripForm'
import type { Trip } from '@/types/trip'
import type { TripFormValues } from '@/schemas/tripSchema'

interface TripFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingTrip?: Trip | null
  onSubmit: (values: TripFormValues, editingId?: string) => Promise<void>
}

function toDatetimeLocal(iso: string): string {
  return iso.slice(0, 16)
}

export function TripFormModal({
  open,
  onOpenChange,
  editingTrip,
  onSubmit,
}: TripFormModalProps) {
  const form = useTripForm({
    defaultValues: editingTrip
      ? {
          startLocation: editingTrip.startLocation,
          endLocation: editingTrip.endLocation,
          startTime: toDatetimeLocal(editingTrip.startTime),
          endTime: toDatetimeLocal(editingTrip.endTime),
          distance: editingTrip.distance,
          distanceUnit: editingTrip.distanceUnit,
          notes: editingTrip.notes ?? '',
        }
      : undefined,
  })

  useEffect(() => {
    if (open) {
      if (editingTrip) {
        form.reset({
          startLocation: editingTrip.startLocation,
          endLocation: editingTrip.endLocation,
          startTime: toDatetimeLocal(editingTrip.startTime),
          endTime: toDatetimeLocal(editingTrip.endTime),
          distance: editingTrip.distance,
          distanceUnit: editingTrip.distanceUnit,
          notes: editingTrip.notes ?? '',
        })
      } else {
        form.reset()
      }
    }
  }, [open, editingTrip])

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values, editingTrip?.id)
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingTrip ? 'Edit Trip' : 'Add Trip'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate>
          <TripFormView form={form} />

          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="overflow-hidden transition-transform active:scale-95"
              onMouseDown={createRipple}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="overflow-hidden transition-transform active:scale-95"
              onMouseDown={createRipple}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Saving…' : editingTrip ? 'Save Changes' : 'Add Trip'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
