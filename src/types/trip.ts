export interface Trip {
  id: string
  deviceId: string
  startLocation: string
  endLocation: string
  startTime: string
  endTime: string
  distance: number
  distanceUnit: 'km' | 'miles'
  notes?: string
  isMemorable: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateTripInput {
  startLocation: string
  endLocation: string
  startTime: string
  endTime: string
  distance: number
  distanceUnit: 'km' | 'miles'
  notes?: string
}

export interface UpdateTripInput {
  startLocation?: string
  endLocation?: string
  startTime?: string
  endTime?: string
  distance?: number
  distanceUnit?: 'km' | 'miles'
  notes?: string
  isMemorable?: boolean
}

export interface TripStats {
  memorableCount: number
  totalDistanceKm: number
  totalDistanceMiles: number
}

export interface PaginatedTripsResponse {
  trips: Trip[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  stats: TripStats
}

export type TripSortOption = 'recent' | 'oldest' | 'distance_asc' | 'distance_desc'

export interface TripFilters {
  memorable: boolean
  hasNotes: boolean
  sort: TripSortOption
}

export type OfflineMutationType = 'create' | 'update' | 'delete' | 'toggleMemorable'

export interface OfflineMutation {
  id: string
  type: OfflineMutationType
  timestamp: number
  payload: CreateTripInput | UpdateTripInput | { isMemorable: boolean } | Record<string, never>
  tripId?: string
  optimisticTrip?: Trip
}
