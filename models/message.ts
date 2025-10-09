import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderRole: {
    type: String,
    enum: ['investor', 'entrepreneur'],
    required: true
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pitchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VerificationRequest',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
})

messageSchema.index({ conversationId: 1, createdAt: -1 })
messageSchema.index({ senderId: 1, recipientId: 1 })

export default mongoose.models.Message || 
  mongoose.model('Message', messageSchema)