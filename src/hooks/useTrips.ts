'use client'

import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as tripService from '@/lib/tripService'
import * as offlineStore from '@/lib/offlineStore'
import type { CreateTripInput, Trip, UpdateTripInput } from '@/types/trip'

const TRIPS_KEY = (page: number) => ['trips', page]

export function useTrips(page = 1) {
  return useQuery({
    queryKey: TRIPS_KEY(page),
    queryFn: () => tripService.getTrips(page),
  })
}

export function useCreateTrip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateTripInput) => {
      if (!navigator.onLine) {
        try {
          await offlineStore.enqueue({
            id: crypto.randomUUID(),
            type: 'create',
            timestamp: Date.now(),
            payload: input,
          })
        } catch {
          toast.error('Offline storage full — cannot save trip offline')
          throw new Error('Offline storage full')
        }
        return null
      }
      return tripService.createTrip(input)
    },
    onMutate: async (input) => {
      if (!navigator.onLine) {
        await queryClient.cancelQueries({ queryKey: ['trips'] })
        const optimisticTrip: Trip = {
          id: crypto.randomUUID(),
          deviceId: '',
          ...input,
          isMemorable: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        queryClient.setQueryData(TRIPS_KEY(1), (old: { trips: Trip[] } | undefined) => {
          if (!old) return old
          return { ...old, trips: [optimisticTrip, ...old.trips] }
        })
        toast.info('Saved offline — will sync when connected')
        return { optimisticTrip }
      }
    },
    onError: (error, _input, context) => {
      if (context?.optimisticTrip) {
        queryClient.setQueryData(TRIPS_KEY(1), (old: { trips: Trip[] } | undefined) => {
          if (!old) return old
          return { ...old, trips: old.trips.filter((t) => t.id !== context.optimisticTrip!.id) }
        })
      }
      toast.error(error instanceof Error ? error.message : 'Failed to create trip')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
    },
  })
}

export function useUpdateTrip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateTripInput }) => {
      if (!navigator.onLine) {
        try {
          await offlineStore.enqueue({
            id: crypto.randomUUID(),
            type: 'update',
            timestamp: Date.now(),
            payload: input,
            tripId: id,
          })
        } catch {
          toast.error('Offline storage full — cannot save trip offline')
          throw new Error('Offline storage full')
        }
        return null
      }
      return tripService.updateTrip(id, input)
    },
    onMutate: async ({ id, input }) => {
      if (!navigator.onLine) {
        await queryClient.cancelQueries({ queryKey: ['trips'] })
        const snapshot = queryClient.getQueriesData({ queryKey: ['trips'] })
        queryClient.setQueriesData({ queryKey: ['trips'] }, (old: { trips: Trip[] } | undefined) => {
          if (!old) return old
          return {
            ...old,
            trips: old.trips.map((t) => (t.id === id ? { ...t, ...input, updatedAt: new Date().toISOString() } : t)),
          }
        })
        toast.info('Saved offline — will sync when connected')
        return { snapshot }
      }
    },
    onError: (_error, _vars, context) => {
      if (context?.snapshot) {
        context.snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data))
      }
      toast.error('Failed to update trip')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
    },
  })
}

export function useDeleteTrip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!navigator.onLine) {
        try {
          await offlineStore.enqueue({
            id: crypto.randomUUID(),
            type: 'delete',
            timestamp: Date.now(),
            payload: {},
            tripId: id,
          })
        } catch {
          toast.error('Offline storage full — cannot save trip offline')
          throw new Error('Offline storage full')
        }
        return
      }
      return tripService.deleteTrip(id)
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['trips'] })
      const snapshot = queryClient.getQueriesData({ queryKey: ['trips'] })
      queryClient.setQueriesData({ queryKey: ['trips'] }, (old: { trips: Trip[] } | undefined) => {
        if (!old) return old
        return { ...old, trips: old.trips.filter((t) => t.id !== id) }
      })
      if (!navigator.onLine) {
        toast.info('Saved offline — will sync when connected')
      }
      return { snapshot }
    },
    onError: (_error, _id, context) => {
      if (context?.snapshot) {
        context.snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data))
      }
      toast.error('Failed to delete trip')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
    },
  })
}

export function useToggleMemorable() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, isMemorable }: { id: string; isMemorable: boolean }) => {
      if (!navigator.onLine) {
        try {
          await offlineStore.enqueue({
            id: crypto.randomUUID(),
            type: 'toggleMemorable',
            timestamp: Date.now(),
            payload: { isMemorable },
            tripId: id,
          })
        } catch {
          toast.error('Offline storage full — cannot save trip offline')
          throw new Error('Offline storage full')
        }
        return null
      }
      return tripService.toggleMemorable(id, isMemorable)
    },
    onMutate: async ({ id, isMemorable }) => {
      await queryClient.cancelQueries({ queryKey: ['trips'] })
      const snapshot = queryClient.getQueriesData({ queryKey: ['trips'] })
      queryClient.setQueriesData({ queryKey: ['trips'] }, (old: { trips: Trip[] } | undefined) => {
        if (!old) return old
        return {
          ...old,
          trips: old.trips.map((t) => (t.id === id ? { ...t, isMemorable } : t)),
        }
      })
      if (!navigator.onLine) {
        toast.info('Saved offline — will sync when connected')
      }
      return { snapshot }
    },
    onError: (_error, _vars, context) => {
      if (context?.snapshot) {
        context.snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data))
      }
      toast.error('Failed to update memorable status')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
    },
  })
}
