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

  const memorable = searchParams.get('memorable') === 'true'
  const hasNotes = searchParams.get('hasNotes') === 'true'
  const sort = searchParams.get('sort') ?? 'recent'

  const orderBy =
    sort === 'distance_asc'  ? { distance: 'asc'  as const } :
    sort === 'distance_desc' ? { distance: 'desc' as const } :
    sort === 'oldest'        ? { createdAt: 'asc' as const } :
                               { createdAt: 'desc' as const }

  const where = {
    deviceId,
    ...(memorable && { isMemorable: true }),
    ...(hasNotes  && { notes: { not: null as unknown as string } }),
  }

  try {
    const [trips, total, memorableCount, distanceGroups] = await Promise.all([
      db.trip.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
      }),
      db.trip.count({ where }),
      db.trip.count({ where: { deviceId, isMemorable: true } }),
      db.trip.groupBy({
        by: ['distanceUnit'],
        where: { deviceId },
        _sum: { distance: true },
      }),
    ])

    const totalDistanceKm = distanceGroups.find((g) => g.distanceUnit === 'km')?._sum.distance ?? 0
    const totalDistanceMiles = distanceGroups.find((g) => g.distanceUnit === 'miles')?._sum.distance ?? 0

    return NextResponse.json({
      trips: trips.map(serializeTrip),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      stats: { memorableCount, totalDistanceKm, totalDistanceMiles },
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

