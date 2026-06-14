'use client'

import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as offlineStore from '@/lib/offlineStore'
import * as tripService from '@/lib/tripService'
import type { OfflineMutation } from '@/types/trip'

export function useOfflineSync() {
  const queryClient = useQueryClient()
  const [queueLength, setQueueLength] = useState(0)

  async function refreshQueueLength() {
    const count = await offlineStore.getMutationCount()
    setQueueLength(count)
  }

  async function flushQueue() {
    const mutations = await offlineStore.getAllMutations()
    if (mutations.length === 0) return

    for (const mutation of mutations) {
      try {
        await applyMutation(mutation)
        await offlineStore.deleteMutation(mutation.id)
      } catch (error: unknown) {
        const status = error instanceof Error && 'status' in error ? (error as { status: number }).status : 0
        if (status >= 400 && status < 500) {
          await offlineStore.deleteMutation(mutation.id)
          toast.error(`Sync error: ${error instanceof Error ? error.message : 'Unknown error'}`)
          continue
        }
        toast.error('Sync failed — will retry on next connection')
        break
      }
    }

    await refreshQueueLength()
    queryClient.invalidateQueries({ queryKey: ['trips'] })
  }

  useEffect(() => {
    refreshQueueLength()

    const handleOnline = () => {
      flushQueue()
    }

    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [queryClient])

  async function enqueue(mutation: OfflineMutation) {
    await offlineStore.enqueue(mutation)
    await refreshQueueLength()
  }

  return { queueLength, enqueue }
}

async function applyMutation(mutation: OfflineMutation): Promise<void> {
  if (mutation.type === 'create') {
    await tripService.createTrip(mutation.payload as Parameters<typeof tripService.createTrip>[0])
  } else if (mutation.type === 'update' && mutation.tripId) {
    await tripService.updateTrip(mutation.tripId, mutation.payload as Parameters<typeof tripService.updateTrip>[1])
  } else if (mutation.type === 'delete' && mutation.tripId) {
    await tripService.deleteTrip(mutation.tripId)
  } else if (mutation.type === 'toggleMemorable' && mutation.tripId) {
    const payload = mutation.payload as { isMemorable: boolean }
    await tripService.toggleMemorable(mutation.tripId, payload.isMemorable)
  }
}
