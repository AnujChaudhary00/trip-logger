'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { createRipple } from '@/lib/ripple'
import { TripLoader } from '@/components/ui/TripLoader'
import { OfflineIndicator } from '@/components/ui/OfflineIndicator'
import { TripStatsBar } from '@/components/ui/TripStatsBar'
import { TripListView } from '@/components/trips/TripListView'
import { TripFormModal } from '@/components/trips/TripFormModal'
import { DeleteConfirmationModal } from '@/components/trips/DeleteConfirmationModal'
import {
  useTrips,
  useCreateTrip,
  useUpdateTrip,
  useDeleteTrip,
  useToggleMemorable,
} from '@/hooks/useTrips'
import { useOfflineSync } from '@/hooks/useOfflineSync'
import type { Trip, TripFilters } from '@/types/trip'
import type { TripFormValues } from '@/schemas/tripSchema'

const DEFAULT_FILTERS: TripFilters = { memorable: false, hasNotes: false, sort: 'recent' }

export function TripsPageContainer() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<TripFilters>(DEFAULT_FILTERS)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [deletingTripId, setDeletingTripId] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)

  const { data, isLoading } = useTrips(page, filters)

  function handleFiltersChange(next: TripFilters) {
    setFilters(next)
    setPage(1)
  }
  const createTrip = useCreateTrip()
  const updateTrip = useUpdateTrip()
  const deleteTrip = useDeleteTrip()
  const toggleMemorable = useToggleMemorable()
  const { queueLength } = useOfflineSync()

  useEffect(() => {
    setIsOnline(navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  function handleAddTrip() {
    setEditingTrip(null)
    setModalOpen(true)
  }

  function handleEditTrip(trip: Trip) {
    setEditingTrip(trip)
    setModalOpen(true)
  }

  function handleDeleteRequest(tripId: string) {
    setDeletingTripId(tripId)
  }

  async function handleFormSubmit(values: TripFormValues, editingId?: string) {
    if (editingId) {
      await updateTrip.mutateAsync({
        id: editingId,
        input: {
          ...values,
          startTime: new Date(values.startTime).toISOString(),
          endTime: new Date(values.endTime).toISOString(),
        },
      })
    } else {
      await createTrip.mutateAsync({
        ...values,
        startTime: new Date(values.startTime).toISOString(),
        endTime: new Date(values.endTime).toISOString(),
      })
    }
  }

  function handleConfirmDelete() {
    if (!deletingTripId) return
    deleteTrip.mutate(deletingTripId)
    setDeletingTripId(null)
  }

  function handleToggleMemorable(tripId: string, isMemorable: boolean) {
    toggleMemorable.mutate({ id: tripId, isMemorable })
  }

  return (
    <div className="relative min-h-screen">

      {/* Subtle travel background */}
      <svg
        className="pointer-events-none fixed inset-0 h-full w-full text-primary opacity-[0.045] dark:opacity-[0.07]"
        viewBox="0 0 1440 900"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden="true"
      >
        {/* Mountain range — right half */}
        <path
          d="M780 720 L870 530 L940 610 L1040 420 L1130 510 L1230 360 L1320 440 L1390 370 L1440 400 L1440 720 Z"
          fill="currentColor"
        />
        {/* Gentle foreground slope */}
        <path
          d="M0 780 Q360 750 720 765 Q1080 780 1440 755 L1440 900 L0 900 Z"
          fill="currentColor"
          opacity="0.5"
        />
        {/* Highway curve sweeping bottom-left → upper-right */}
        <path
          d="M-60 920 C120 840 320 740 540 660 C740 580 960 535 1160 465 C1320 405 1390 355 1440 320"
          stroke="currentColor"
          strokeWidth="72"
          strokeLinecap="round"
        />
        {/* Road center-line dashes */}
        <path
          d="M-60 920 C120 840 320 740 540 660 C740 580 960 535 1160 465 C1320 405 1390 355 1440 320"
          stroke="white"
          strokeWidth="5"
          strokeDasharray="48 28"
          strokeLinecap="round"
          opacity="0.28"
        />
        {/* Map pin A */}
        <circle cx="260" cy="210" r="11" fill="currentColor"/>
        <circle cx="260" cy="210" r="24" stroke="currentColor" strokeWidth="3" opacity="0.55"/>
        {/* Map pin B */}
        <circle cx="780" cy="130" r="9" fill="currentColor"/>
        <circle cx="780" cy="130" r="20" stroke="currentColor" strokeWidth="2.5" opacity="0.55"/>
        {/* Map pin C */}
        <circle cx="1230" cy="175" r="7" fill="currentColor"/>
        <circle cx="1230" cy="175" r="16" stroke="currentColor" strokeWidth="2" opacity="0.55"/>
        {/* Dashed route connecting pins */}
        <path
          d="M260 210 Q520 160 780 130 Q1010 110 1230 175"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeDasharray="10 14"
          strokeLinecap="round"
          opacity="0.55"
        />
      </svg>

    <div className="container relative py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-xl font-bold sm:text-2xl">My Trips</h1>
          <OfflineIndicator isOnline={isOnline} queueLength={queueLength} />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />
          <Button
            onClick={handleAddTrip}
            onMouseDown={createRipple}
            aria-label="Add a new trip"
            className="overflow-hidden transition-transform active:scale-95"
          >
            <Plus className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:rotate-90" aria-hidden="true" />
            Add Trip
          </Button>
        </div>
      </div>

      {data && data.total > 0 && (
        <TripStatsBar stats={data.stats} total={data.total} />
      )}

      {isLoading ? (
        <TripLoader />
      ) : (
        <TripListView
          data={data}
          page={page}
          filters={filters}
          onPageChange={setPage}
          onFiltersChange={handleFiltersChange}
          onAddTrip={handleAddTrip}
          onEdit={handleEditTrip}
          onDelete={handleDeleteRequest}
          onToggleMemorable={handleToggleMemorable}
        />
      )}

      <TripFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editingTrip={editingTrip}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmationModal
        open={deletingTripId !== null}
        onOpenChange={(open) => { if (!open) setDeletingTripId(null) }}
        onConfirm={handleConfirmDelete}
      />
    </div>
    </div>
  )
}
