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
        'relative overflow-hidden flex flex-col h-full rounded-xl border bg-card shadow-sm transition-all duration-200',
        'hover:-translate-y-1 hover:shadow-[0_8px_24px_hsl(var(--primary)/0.18)] hover:border-primary/30',
      )}
    >
      {/* Paper fold for memorable trips */}
      {trip.isMemorable && (
        <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-0 h-0 border-l-[64px] border-l-transparent border-t-[64px] border-t-primary" />
          <span className="absolute top-[15px] right-[-3px] text-[7px] font-bold text-primary-foreground rotate-45 tracking-wide uppercase w-[52px] text-center leading-none">
            Memorable
          </span>
        </div>
      )}
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
            className={cn(
              'shrink-0 overflow-hidden transition-all duration-300 active:scale-95 -mt-0.5 hover:bg-primary/10',
              trip.isMemorable ? 'mr-10' : 'mr-0'
            )}
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
            {formatDate(trip.startTime) !== formatDate(trip.endTime) && (
              <> – {formatDate(trip.endTime)}</>
            )}
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
          className="h-7 overflow-hidden px-2 text-xs transition-transform active:scale-95 hover:bg-primary/10 hover:text-primary"
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
          className="h-7 overflow-hidden px-2 text-xs text-destructive hover:!bg-destructive/10 hover:!text-destructive transition-transform active:scale-95"
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
