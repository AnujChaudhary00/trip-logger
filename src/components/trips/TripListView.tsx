'use client'

import { TripCard } from '@/components/trips/TripCard'
import { TripFilters } from '@/components/trips/TripFilters'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/button'
import { createRipple } from '@/lib/ripple'
import type { Trip, PaginatedTripsResponse, TripFilters as TripFiltersType } from '@/types/trip'

interface TripListViewProps {
  data: PaginatedTripsResponse | undefined
  page: number
  filters: TripFiltersType
  onPageChange: (page: number) => void
  onFiltersChange: (filters: TripFiltersType) => void
  onAddTrip: () => void
  onEdit: (trip: Trip) => void
  onDelete: (tripId: string) => void
  onToggleMemorable: (tripId: string, isMemorable: boolean) => void
}

export function TripListView({
  data,
  page,
  filters,
  onPageChange,
  onFiltersChange,
  onAddTrip,
  onEdit,
  onDelete,
  onToggleMemorable,
}: TripListViewProps) {
  const isEmpty = !data || data.trips.length === 0
  const noResultsFromFilter = isEmpty && (filters.memorable || filters.hasNotes)

  return (
    <div>
      <TripFilters filters={filters} onChange={onFiltersChange} />

      {isEmpty ? (
        noResultsFromFilter ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No trips match the current filters.
          </div>
        ) : (
          <EmptyState onAddTrip={onAddTrip} />
        )
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.trips.map((trip, index) => (
            <div
              key={trip.id}
              className="animate-slide-in-up h-full"
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
      )}

      {data && data.totalPages > 1 && (
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
