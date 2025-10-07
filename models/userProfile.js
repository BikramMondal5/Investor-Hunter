import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    trim: true,
    default: ''
  },
  lastName: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  company: {
    type: String,
    trim: true,
    default: ''
  },
  profilePhoto: {
    type: String,
    default: null 
  },
  notifications: {
    investorInterest: {
      type: Boolean,
      default: true
    },
    messages: {
      type: Boolean,
      default: true
    },
    communityFeedback: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Create a profile when user is created
userProfileSchema.statics.createFromUser = async function(user) {
  const nameParts = user.name ? user.name.split(' ') : ['', ''];
  
  return this.create({
    userId: user._id,
    firstName: user.firstName || nameParts[0] || '',
    lastName: user.lastName || nameParts[1] || '',
    email: user.email,
    company: '',
    profilePhoto: user.avatar || null
  });
};

export default mongoose.models.UserProfile || mongoose.model('UserProfile', userProfileSchema);