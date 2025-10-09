import mongoose from 'mongoose'

const savedPitchSchema = new mongoose.Schema({
  investorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pitchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VerificationRequest',
    required: true
  },
  entrepreneurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

savedPitchSchema.index({ investorId: 1, pitchId: 1 }, { unique: true })

export default mongoose.models.SavedPitch || 
  mongoose.model('SavedPitch', savedPitchSchema)