import { z } from 'zod'
import dbConnect from '@/lib/dbConnect'
import NGO from '@/models/NGO'
import { validateBody } from '@/lib/validate'
import { withErrorHandling } from '@/lib/apiHandler'

const ngoSchema = z.object({
  name:      z.string().min(2),
  lat:       z.number().min(-90).max(90),
  lng:       z.number().min(-180).max(180),
  address:   z.string().optional().default(''),
  timing:    z.string().optional().default(''),
  materials: z.array(z.string()).min(1),
  phone:     z.string().optional().default(''),
  email:     z.string().email(),
  area:      z.string().min(2),
  city:      z.string().optional().default(''),
  type:      z.enum(['year_round', 'festival']).optional().default('year_round'),
})

// GET /api/ngos — Return all verified NGOs for the map
export const GET = withErrorHandling(async () => {
  await dbConnect()
  const ngos = await NGO.find({ verified: true }).lean()
  const data = ngos.map(({ __v, ...rest }) => rest)
  return Response.json({ success: true, data })
})

// POST /api/ngos — Register a new NGO (unverified by default)
export const POST = withErrorHandling(async (req) => {
  await dbConnect()
  const body = await req.json()
  const { ok, data, error } = validateBody(ngoSchema, body)
  if (!ok) return error

  const ngo = await NGO.create({ ...data, verified: false })
  const { __v, ...result } = ngo.toObject()
  return Response.json({ success: true, data: result }, { status: 201 })
})
