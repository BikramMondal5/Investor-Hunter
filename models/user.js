// models/user.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    sparse: true,
    unique: true,
    default: null
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['entrepreneur', 'investor'],
    default: 'entrepreneur'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: function() { return this.provider === 'local'; }
  },
  avatar: {
    type: String,
    default: null
  },
  provider: {
    type: String,
    required: true,
    enum: ['google', 'local'],
    default: 'local'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      delete ret.password;
      return ret;
    }
  }
});

// Pre-save middleware
userSchema.pre('save', function(next) {
  if (this.isNew) {
    this.lastLogin = new Date();
  }
  next();
});

// Instance methods
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Static methods
userSchema.statics.findByGoogleId = function(googleId) {
  return this.findOne({ googleId });
};

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

export default mongoose.models.User || mongoose.model('User', userSchema);