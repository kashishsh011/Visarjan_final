import dbConnect from '@/lib/dbConnect'
import DropOff from '@/models/DropOff'
import NGO from '@/models/NGO'
import { withErrorHandling } from '@/lib/apiHandler'

// Always fetch live stats dynamically
export const dynamic = 'force-dynamic'

// GET /api/stats — Aggregate impact numbers
export const GET = withErrorHandling(async () => {
  await dbConnect()

  const [totalDropOffs, totalNGOs, weightAgg, recentDropOffs] = await Promise.all([
    DropOff.countDocuments(),
    NGO.countDocuments({ verified: true }),
    DropOff.aggregate([{ $group: { _id: null, total: { $sum: '$weightKg' } } }]),
    DropOff.find().sort({ createdAt: -1 }).limit(8).lean(),
  ])

  const totalWeightKg = weightAgg.length > 0 ? weightAgg[0].total : 0

  return Response.json({
    success: true,
    data: {
      totalDropOffs,
      totalWeightKg,
      totalNGOs,
      recentDropOffs: recentDropOffs.map(({ __v, ...rest }) => rest),
    },
  })
})
