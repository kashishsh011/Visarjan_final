import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import { withErrorHandling } from '@/lib/apiHandler'

// GET — fetch current user's profile including role
export const GET = withErrorHandling(async (req) => {
  const session = await getServerSession(authOptions)
  if (!session) {
    return Response.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }
  await dbConnect()
  const user = await User.findOne({ email: session.user.email }).lean()
  if (!user) {
    return Response.json({ success: false, error: 'User not found' }, { status: 404 })
  }
  const { __v, ...userData } = user
  return Response.json({ success: true, data: userData })
})

// PATCH — update current user's role after form submission
export const PATCH = withErrorHandling(async (req) => {
  const session = await getServerSession(authOptions)
  if (!session) {
    return Response.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }
  const body = await req.json()
  const allowedRoles = ['citizen', 'ngo_admin']
  if (!allowedRoles.includes(body.role)) {
    return Response.json({ success: false, error: 'Invalid role' }, { status: 400 })
  }
  await dbConnect()
  const user = await User.findOneAndUpdate(
    { email: session.user.email },
    { role: body.role },
    { new: true }
  ).lean()
  const { __v, ...userData } = user
  return Response.json({ success: true, data: userData })
})
