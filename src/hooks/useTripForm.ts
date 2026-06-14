'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tripSchema, type TripFormValues } from '@/schemas/tripSchema'

interface UseTripFormOptions {
  defaultValues?: Partial<TripFormValues>
}

export function useTripForm({ defaultValues }: UseTripFormOptions = {}) {
  return useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      startLocation: '',
      endLocation: '',
      startTime: '',
      endTime: '',
      distance: undefined,
      distanceUnit: 'km',
      notes: '',
      ...defaultValues,
    },
  })
}
