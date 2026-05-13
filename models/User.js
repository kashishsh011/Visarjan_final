import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, sparse: true, default: null },
  phone:     { type: String, default: '' },
  area:      { type: String, default: '' },
  role:      { type: String, enum: ['citizen', 'ngo_admin'], default: 'citizen' },
  image:     { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
