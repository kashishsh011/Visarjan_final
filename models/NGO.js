import mongoose from 'mongoose'

const NGOSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  lat:       { type: Number, required: true },
  lng:       { type: Number, required: true },
  address:   { type: String, default: '' },
  timing:    { type: String, default: '' },
  materials: { type: [String], default: [] },
  phone:     { type: String, default: '' },
  email:     { type: String, default: '' },
  area:      { type: String, default: '' },
  city:      { type: String, default: '' },
  type:      { type: String, enum: ['year_round', 'festival'], default: 'year_round' },
  verified:  { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.NGO || mongoose.model('NGO', NGOSchema)
