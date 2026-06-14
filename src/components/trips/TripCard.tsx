'use client'

import { useRef } from 'react'
import { Star, Pencil, Trash2, MapPin, Clock, Gauge, StickyNote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createRipple } from '@/lib/ripple'
import type { Trip } from '@/types/trip'

interface TripCardProps {
  trip: Trip
  onEdit: (trip: Trip) => void
  onDelete: (tripId: string) => void
  onToggleMemorable: (tripId: string, isMemorable: boolean) => void
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' })
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { timeStyle: 'short' })
}

export function TripCard({ trip, onEdit, onDelete, onToggleMemorable }: TripCardProps) {
  const starRef = useRef<HTMLSpanElement>(null)

  function handleToggleMemorable() {
    if (starRef.current) {
      starRef.current.classList.remove('animate-star-pop')
      void starRef.current.offsetWidth
      starRef.current.classList.add('animate-star-pop')
    }
    onToggleMemorable(trip.id, !trip.isMemorable)
  }

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border bg-card shadow-sm transition-all duration-200',
        'hover:-translate-y-1 hover:shadow-lg',
        trip.isMemorable && 'border-yellow-400 ring-2 ring-yellow-300/60'
      )}
    >
      {/* Body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Route + star */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm font-semibold truncate">{trip.startLocation}</span>
            </div>
            <div className="ml-[7px] w-px h-3 bg-border" aria-hidden="true" />
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
              <span className="text-sm font-semibold truncate">{trip.endLocation}</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 overflow-hidden transition-transform active:scale-95 -mt-0.5"
            onMouseDown={createRipple}
            onClick={handleToggleMemorable}
            aria-label={trip.isMemorable ? 'Unmark as memorable' : 'Mark as memorable'}
            aria-pressed={trip.isMemorable}
          >
            <span ref={starRef} className="inline-flex">
              <Star
                className={cn(
                  'h-4 w-4 transition-colors duration-200',
                  trip.isMemorable ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                )}
                aria-hidden="true"
              />
            </span>
          </Button>
        </div>

        {/* Chips row */}
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {formatDate(trip.startTime)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
            {formatTime(trip.startTime)} – {formatTime(trip.endTime)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
            <Gauge className="h-3 w-3" aria-hidden="true" />
            {trip.distance} {trip.distanceUnit}
          </span>
        </div>

        {/* Notes */}
        {trip.notes && (
          <div className="flex items-start gap-1.5 rounded-lg bg-muted/50 px-2.5 py-2">
            <StickyNote className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" aria-hidden="true" />
            <p className="text-xs text-muted-foreground line-clamp-2">{trip.notes}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-1 border-t px-3 py-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 overflow-hidden px-2 text-xs transition-transform active:scale-95"
          onMouseDown={createRipple}
          onClick={() => onEdit(trip)}
          aria-label={`Edit trip from ${trip.startLocation} to ${trip.endLocation}`}
        >
          <Pencil className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 overflow-hidden px-2 text-xs text-destructive hover:text-destructive transition-transform active:scale-95"
          onMouseDown={createRipple}
          onClick={() => onDelete(trip.id)}
          aria-label={`Delete trip from ${trip.startLocation} to ${trip.endLocation}`}
        >
          <Trash2 className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
          Delete
        </Button>
      </div>
    </div>
  )
}
