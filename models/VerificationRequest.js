import mongoose from 'mongoose'

const verificationRequestSchema = new mongoose.Schema({
  personalInfo: {
    fullName: { type: String, required: true },
    businessName: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    businessRegistrationNumber: { type: String, required: true },
    industryType: { type: String, required: true },
    country: { type: String, required: true }
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