'use client'

import { useRef } from 'react'
import { Star, Pencil, Trash2, MapPin, Clock, Gauge } from 'lucide-react'
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

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
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
        'rounded-lg border bg-card p-4 shadow-sm transition-all duration-200',
        'hover:-translate-y-0.5 hover:shadow-md',
        trip.isMemorable && 'border-yellow-400 ring-2 ring-yellow-300'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm font-medium">
            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="truncate max-w-[35vw] sm:max-w-none">{trip.startLocation}</span>
            <span className="text-muted-foreground shrink-0">→</span>
            <span className="truncate max-w-[35vw] sm:max-w-none">{trip.endLocation}</span>
          </div>

          <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {formatDateTime(trip.startTime)}
            </span>
            <span className="flex items-center gap-1">
              <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
              {trip.distance} {trip.distanceUnit}
            </span>
          </div>

          {trip.notes && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{trip.notes}</p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="overflow-hidden transition-transform active:scale-95"
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

          <Button
            variant="ghost"
            size="icon"
            className="overflow-hidden transition-transform active:scale-95"
            onMouseDown={createRipple}
            onClick={() => onEdit(trip)}
            aria-label={`Edit trip from ${trip.startLocation} to ${trip.endLocation}`}
          >
            <Pencil className="h-4 w-4 transition-colors duration-150 group-hover:text-primary" aria-hidden="true" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="overflow-hidden transition-transform active:scale-95"
            onMouseDown={createRipple}
            onClick={() => onDelete(trip.id)}
            aria-label={`Delete trip from ${trip.startLocation} to ${trip.endLocation}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}
