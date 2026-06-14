'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createRipple } from '@/lib/ripple'
import { OfflineIndicator } from '@/components/ui/OfflineIndicator'
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
import type { Trip } from '@/types/trip'
import type { TripFormValues } from '@/schemas/tripSchema'

export function TripsPageContainer() {
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [deletingTripId, setDeletingTripId] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)

  const { data, isLoading } = useTrips(page)
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
    <div className="container py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-xl font-bold sm:text-2xl">My Trips</h1>
          <OfflineIndicator isOnline={isOnline} queueLength={queueLength} />
        </div>
        <Button
          onClick={handleAddTrip}
          onMouseDown={createRipple}
          aria-label="Add a new trip"
          className="shrink-0 overflow-hidden transition-transform active:scale-95"
        >
          <Plus className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:rotate-90" aria-hidden="true" />
          Add Trip
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <span className="text-muted-foreground">Loading trips…</span>
        </div>
      ) : (
        <TripListView
          data={data}
          page={page}
          onPageChange={setPage}
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
  )
}
