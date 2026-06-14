import { z } from 'zod'

export const tripBaseSchema = z.object({
  startLocation: z.string().min(1, 'Start location is required').max(255, 'Start location must be 255 characters or fewer'),
  endLocation: z.string().min(1, 'End location is required').max(255, 'End location must be 255 characters or fewer'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  distance: z.number({ invalid_type_error: 'Distance must be a number' }).positive('Distance must be greater than 0'),
  distanceUnit: z.enum(['km', 'miles'], { required_error: 'Distance unit is required' }),
  notes: z.string().max(500, 'Notes must be 500 characters or fewer').optional(),
})

export const tripSchema = tripBaseSchema.refine(
  (data) => new Date(data.endTime) > new Date(data.startTime),
  { message: 'End time must be after start time', path: ['endTime'] }
)

export type TripFormValues = z.infer<typeof tripSchema>
