import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import DropOff from '@/models/DropOff'
import { withErrorHandling } from '@/lib/apiHandler'

// GET — fetch current user's drop-off history
export const GET = withErrorHandling(async (req) => {
  const session = await getServerSession(authOptions)
  if (!session) {
    return Response.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }
  await dbConnect()
  const user = await User.findOne({ email: session.user.email }).lean()
  if (!user) {
    return Response.json({ success: true, data: [] })
  }

  // Query by userName matching the user's name (case-insensitive)
  const drops = await DropOff.find({ userName: user.name })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean()

  const cleaned = drops.map(({ __v, ...d }) => d)
  return Response.json({ success: true, data: cleaned })
})
