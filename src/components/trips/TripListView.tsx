'use client'

import { TripCard } from '@/components/trips/TripCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/button'
import { createRipple } from '@/lib/ripple'
import type { Trip, PaginatedTripsResponse } from '@/types/trip'

interface TripListViewProps {
  data: PaginatedTripsResponse | undefined
  page: number
  onPageChange: (page: number) => void
  onAddTrip: () => void
  onEdit: (trip: Trip) => void
  onDelete: (tripId: string) => void
  onToggleMemorable: (tripId: string, isMemorable: boolean) => void
}

export function TripListView({
  data,
  page,
  onPageChange,
  onAddTrip,
  onEdit,
  onDelete,
  onToggleMemorable,
}: TripListViewProps) {
  if (!data || data.trips.length === 0) {
    return <EmptyState onAddTrip={onAddTrip} />
  }

  return (
    <div>
      <div className="flex flex-col gap-3">
        {data.trips.map((trip, index) => (
          <div
            key={trip.id}
            className="animate-slide-in-up"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <TripCard
              trip={trip}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleMemorable={onToggleMemorable}
            />
          </div>
        ))}
      </div>

      {data.totalPages > 1 && (
        <nav
          className="mt-6 flex items-center justify-between"
          aria-label="Trip list pagination"
        >
          <Button
            variant="outline"
            className="overflow-hidden transition-transform active:scale-95"
            onMouseDown={createRipple}
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground" aria-live="polite">
            Page {page} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            className="overflow-hidden transition-transform active:scale-95"
            onMouseDown={createRipple}
            onClick={() => onPageChange(page + 1)}
            disabled={page >= data.totalPages}
            aria-label="Next page"
          >
            Next
          </Button>
        </nav>
      )}
    </div>
  )
}
