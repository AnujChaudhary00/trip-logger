import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { badRequest, serverError } from '@/lib/apiError'
import { tripSchema } from '@/schemas/tripSchema'
import { serializeTrip } from '@/lib/serializeTrip'

const PAGE_SIZE = 50

export async function GET(req: NextRequest) {
  const deviceId = req.headers.get('X-Device-ID')
  if (!deviceId) return badRequest('X-Device-ID header is required')

  const { searchParams } = new URL(req.url)
  const rawPage = parseInt(searchParams.get('page') ?? '1', 10)
  const rawPageSize = parseInt(searchParams.get('pageSize') ?? String(PAGE_SIZE), 10)
  const page = Math.max(1, isNaN(rawPage) ? 1 : rawPage)
  const pageSize = Math.min(100, isNaN(rawPageSize) ? PAGE_SIZE : rawPageSize)
  const skip = (page - 1) * pageSize

  try {
    const [trips, total] = await Promise.all([
      db.trip.findMany({
        where: { deviceId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      db.trip.count({ where: { deviceId } }),
    ])

    return NextResponse.json({
      trips: trips.map(serializeTrip),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    })
  } catch {
    return serverError('Failed to fetch trips')
  }
}

export async function POST(req: NextRequest) {
  const deviceId = req.headers.get('X-Device-ID')
  if (!deviceId) return badRequest('X-Device-ID header is required')

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return badRequest('Invalid request body')
  }

  try {
    const b = body as Record<string, unknown>
    const parsed = tripSchema.safeParse({
      ...b,
      distance: typeof b.distance === 'string' ? parseFloat(b.distance) : b.distance,
    })

    if (!parsed.success) {
      return badRequest(parsed.error.errors.map((e) => e.message).join(', '))
    }

    const trip = await db.trip.create({
      data: {
        ...parsed.data,
        startTime: new Date(parsed.data.startTime),
        endTime: new Date(parsed.data.endTime),
        deviceId,
      },
    })

    return NextResponse.json(serializeTrip(trip), { status: 201 })
  } catch {
    return serverError('Failed to create trip')
  }
}

