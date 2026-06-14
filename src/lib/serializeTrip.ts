import type { Trip } from '@prisma/client'

export function serializeTrip(trip: Trip) {
  const { deviceId: _deviceId, ...rest } = trip
  return {
    ...rest,
    startTime: trip.startTime.toISOString(),
    endTime: trip.endTime.toISOString(),
    createdAt: trip.createdAt.toISOString(),
    updatedAt: trip.updatedAt.toISOString(),
    notes: trip.notes ?? undefined,
  }
}
