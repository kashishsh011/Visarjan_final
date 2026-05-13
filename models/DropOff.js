import mongoose from 'mongoose'

const DropOffSchema = new mongoose.Schema({
  certId:    { type: String, required: true, unique: true },
  userName:  { type: String, required: true },
  item:      { type: String, required: true },
  ngoName:   { type: String, required: true },
  weightKg:  { type: Number, required: true },
  userId:    { type: String, default: null },
  ngoId:     { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.DropOff || mongoose.model('DropOff', DropOffSchema)
