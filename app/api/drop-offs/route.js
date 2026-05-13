import { z } from 'zod'
import { nanoid } from 'nanoid'
import dbConnect from '@/lib/dbConnect'
import DropOff from '@/models/DropOff'
import { validateBody } from '@/lib/validate'
import { withErrorHandling } from '@/lib/apiHandler'

const dropOffSchema = z.object({
  userName:  z.string().min(1),
  item:      z.string().min(1),
  ngoName:   z.string().min(1),
  weightKg:  z.number().gt(0),
})

// POST /api/drop-offs — Record a new drop-off and generate a certificate ID
export const POST = withErrorHandling(async (req) => {
  await dbConnect()
  const body = await req.json()
  const { ok, data, error } = validateBody(dropOffSchema, body)
  if (!ok) return error

  const certId = nanoid(10)
  const dropOff = await DropOff.create({ ...data, certId })
  const { __v, ...result } = dropOff.toObject()
  return Response.json({ success: true, data: result }, { status: 201 })
})
