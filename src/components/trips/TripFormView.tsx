'use client'

import { type UseFormReturn, Controller } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { TripFormValues } from '@/schemas/tripSchema'

interface TripFormViewProps {
  form: UseFormReturn<TripFormValues>
}

const NOTES_MAX = 500

export function TripFormView({ form }: TripFormViewProps) {
  const {
    register,
    formState: { errors },
    watch,
    control,
  } = form

  const notes = watch('notes') ?? ''

  return (
    <div className="grid gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="startLocation">Start Location</Label>
        <Input
          id="startLocation"
          aria-describedby={errors.startLocation ? 'startLocation-error' : undefined}
          {...register('startLocation')}
        />
        {errors.startLocation && (
          <p id="startLocation-error" className="text-sm text-destructive" role="alert">
            {errors.startLocation.message}
          </p>
        )}
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="endLocation">End Location</Label>
        <Input
          id="endLocation"
          aria-describedby={errors.endLocation ? 'endLocation-error' : undefined}
          {...register('endLocation')}
        />
        {errors.endLocation && (
          <p id="endLocation-error" className="text-sm text-destructive" role="alert">
            {errors.endLocation.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="datetime-local"
            aria-describedby={errors.startTime ? 'startTime-error' : undefined}
            {...register('startTime')}
          />
          {errors.startTime && (
            <p id="startTime-error" className="text-sm text-destructive" role="alert">
              {errors.startTime.message}
            </p>
          )}
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="datetime-local"
            aria-describedby={errors.endTime ? 'endTime-error' : undefined}
            {...register('endTime')}
          />
          {errors.endTime && (
            <p id="endTime-error" className="text-sm text-destructive" role="alert">
              {errors.endTime.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="distance">Distance</Label>
          <Input
            id="distance"
            type="number"
            step="0.1"
            min="0"
            aria-describedby={errors.distance ? 'distance-error' : undefined}
            {...register('distance', { valueAsNumber: true })}
          />
          {errors.distance && (
            <p id="distance-error" className="text-sm text-destructive" role="alert">
              {errors.distance.message}
            </p>
          )}
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="distanceUnit">Unit</Label>
          <Controller
            name="distanceUnit"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="distanceUnit" aria-label="Distance unit">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="km">km</SelectItem>
                  <SelectItem value="miles">miles</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="notes">Notes (optional)</Label>
          <span
            className="text-xs text-muted-foreground"
            aria-live="polite"
            aria-label={`${notes.length} of ${NOTES_MAX} characters used`}
          >
            {notes.length}/{NOTES_MAX}
          </span>
        </div>
        <Textarea
          id="notes"
          rows={3}
          maxLength={NOTES_MAX}
          aria-describedby={errors.notes ? 'notes-error' : undefined}
          {...register('notes')}
        />
        {errors.notes && (
          <p id="notes-error" className="text-sm text-destructive" role="alert">
            {errors.notes.message}
          </p>
        )}
      </div>
    </div>
  )
}
