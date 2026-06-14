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

export interface PaginatedTripsResponse {
  trips: Trip[]
  total: number
  page: number
  pageSize: number
  totalPages: number
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
