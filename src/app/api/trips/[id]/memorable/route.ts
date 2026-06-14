import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { badRequest, notFound, serverError } from '@/lib/apiError'
import { serializeTrip } from '@/lib/serializeTrip'

const memorableSchema = z.object({
  isMemorable: z.boolean(),
})

type Params = { params: { id: string } }

export async function PATCH(req: NextRequest, { params }: Params) {
  const deviceId = req.headers.get('X-Device-ID')
  if (!deviceId) return badRequest('X-Device-ID header is required')

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return badRequest('Invalid request body')
  }

  try {
    const parsed = memorableSchema.safeParse(body)
    if (!parsed.success) {
      return badRequest('isMemorable must be a boolean')
    }

    const existing = await db.trip.findUnique({ where: { id: params.id } })
    if (!existing || existing.deviceId !== deviceId) {
      return notFound('Trip not found')
    }

    const updated = await db.trip.update({
      where: { id: params.id },
      data: { isMemorable: parsed.data.isMemorable },
    })

    return NextResponse.json(serializeTrip(updated))
  } catch {
    return serverError('Failed to toggle memorable')
  }
}
