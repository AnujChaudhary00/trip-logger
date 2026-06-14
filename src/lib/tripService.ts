'use client'

import { getDeviceId } from '@/lib/deviceId'
import type {
  CreateTripInput,
  PaginatedTripsResponse,
  Trip,
  TripFilters,
  UpdateTripInput,
} from '@/types/trip'

const PAGE_SIZE = 50

class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const deviceId = getDeviceId()
  const res = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Device-ID': deviceId,
      ...(init?.headers ?? {}),
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }))
    throw new ApiError(body.error ?? res.statusText, res.status)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export function getTrips(page = 1, filters?: Partial<TripFilters>): Promise<PaginatedTripsResponse> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) })
  if (filters?.memorable) params.set('memorable', 'true')
  if (filters?.hasNotes)  params.set('hasNotes', 'true')
  if (filters?.sort && filters.sort !== 'recent') params.set('sort', filters.sort)
  return request<PaginatedTripsResponse>(`/api/trips?${params.toString()}`)
}

export function createTrip(input: CreateTripInput): Promise<Trip> {
  return request<Trip>('/api/trips', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateTrip(id: string, input: UpdateTripInput): Promise<Trip> {
  return request<Trip>(`/api/trips/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export function deleteTrip(id: string): Promise<void> {
  return request<void>(`/api/trips/${id}`, { method: 'DELETE' })
}

export function toggleMemorable(id: string, isMemorable: boolean): Promise<Trip> {
  return request<Trip>(`/api/trips/${id}/memorable`, {
    method: 'PATCH',
    body: JSON.stringify({ isMemorable }),
  })
}
