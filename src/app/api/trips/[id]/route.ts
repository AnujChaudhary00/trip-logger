import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { badRequest, notFound, serverError } from '@/lib/apiError'
import { tripBaseSchema } from '@/schemas/tripSchema'
import { serializeTrip } from '@/lib/serializeTrip'

type Params = { params: { id: string } }

export async function PUT(req: NextRequest, { params }: Params) {
  const deviceId = req.headers.get('X-Device-ID')
  if (!deviceId) return badRequest('X-Device-ID header is required')

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return badRequest('Invalid request body')
  }

  try {
    const existing = await db.trip.findUnique({ where: { id: params.id } })
    if (!existing || existing.deviceId !== deviceId) {
      return notFound('Trip not found')
    }

    const b = body as Record<string, unknown>
    const parsed = tripBaseSchema.partial().safeParse({
      ...b,
      distance: b.distance !== undefined
        ? typeof b.distance === 'string' ? parseFloat(b.distance as string) : b.distance
        : undefined,
    })

    if (!parsed.success) {
      return badRequest(parsed.error.errors.map((e) => e.message).join(', '))
    }

    const updated = await db.trip.update({
      where: { id: params.id },
      data: {
        ...parsed.data,
        ...(parsed.data.startTime ? { startTime: new Date(parsed.data.startTime) } : {}),
        ...(parsed.data.endTime ? { endTime: new Date(parsed.data.endTime) } : {}),
      },
    })

    return NextResponse.json(serializeTrip(updated))
  } catch {
    return serverError('Failed to update trip')
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const deviceId = req.headers.get('X-Device-ID')
  if (!deviceId) return badRequest('X-Device-ID header is required')

  try {
    const existing = await db.trip.findUnique({ where: { id: params.id } })
    if (!existing || existing.deviceId !== deviceId) {
      return notFound('Trip not found')
    }

    await db.trip.delete({ where: { id: params.id } })
    return new NextResponse(null, { status: 204 })
  } catch {
    return serverError('Failed to delete trip')
  }
}

