import { z } from 'zod'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import { validateBody } from '@/lib/validate'
import { withErrorHandling } from '@/lib/apiHandler'

const citizenSchema = z.object({
  name:  z.string().min(2),
  phone: z.string().min(10),
  area:  z.string().min(2),
})

// POST /api/citizens — Register a citizen for eco-drive notifications
export const POST = withErrorHandling(async (req) => {
  await dbConnect()
  const body = await req.json()
  const { ok, data, error } = validateBody(citizenSchema, body)
  if (!ok) return error

  const user = await User.create({ ...data, role: 'citizen' })
  const { __v, ...result } = user.toObject()
  return Response.json({ success: true, data: result }, { status: 201 })
})
