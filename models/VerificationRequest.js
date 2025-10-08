import mongoose from 'mongoose'

const verificationRequestSchema = new mongoose.Schema({
  personalInfo: {
    userId: { 
      type: String, 
      default: () => `USER_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
    },
    fullName: { type: String, required: false }, 
    businessName: { type: String, required: false }, 
    email: { type: String, required: true },
    contactNumber: { type: String, required: false }, 
    businessRegistrationNumber: { type: String, required: false }, 
    industryType: { type: String, required: false }, 
    country: { type: String, required: false } 
  },
  pitchData: {
    videoUrl: String,
    startupName: String,
    oneLiner: String,
    industry: String,
    location: String,
    stage: String,
    isPublic: { type: Boolean, default: false }
  },
  documents: {
    required: [{
        documentId: String,
        documentType: String,
        fileUrls: [String], // Changed from fileUrl to fileUrls array
        fileCount: Number,
        status: {
        type: String,
        enum: ['pending_verification', 'approved', 'rejected'],
        default: 'pending_verification'
        }
    }],
    optional: [{
        documentId: String,
        documentType: String,
        fileUrls: [String], // Changed from fileUrl to fileUrls array
        fileCount: Number,
        status: {
        type: String,
        enum: ['pending_verification', 'approved', 'rejected'],
        default: 'pending_verification'
        }
    }]
    },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'needs_clarification'],
    default: 'pending'
  },
  rejectionReason: String,
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  userProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserProfile'
  }
}, {
  timestamps: true
})

export default mongoose.models.VerificationRequest || 
  mongoose.model('VerificationRequest', verificationRequestSchema)