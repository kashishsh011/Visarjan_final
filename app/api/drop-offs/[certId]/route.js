import dbConnect from '@/lib/dbConnect'
import DropOff from '@/models/DropOff'
import { withErrorHandling } from '@/lib/apiHandler'

// GET /api/drop-offs/:certId — Public certificate verification
export const GET = withErrorHandling(async (req, { params }) => {
  await dbConnect()
  const { certId } = await params
  const dropOff = await DropOff.findOne({ certId }).lean()

  if (!dropOff) {
    return Response.json(
      { success: false, error: 'Certificate not found' },
      { status: 404 }
    )
  }

  const { __v, ...data } = dropOff
  return Response.json({ success: true, data })
})
