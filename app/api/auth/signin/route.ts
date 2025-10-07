import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import UserProfile from '@/models/userProfile';

async function connectDB() {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.DATABASE_URL as string);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }
    
    if (user.provider === 'google' && !user.password) {
      return NextResponse.json(
        { success: false, message: "Please sign in with Google" },
        { status: 401 }
      );
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }
    
    user.lastLogin = new Date();
    await user.save();
    
    // Fetch or create profile
    let profile = await UserProfile.findOne({ userId: user._id });
    if (!profile) {
      const nameParts = user.name ? user.name.split(' ') : ['', ''];
      profile = await UserProfile.create({
        userId: user._id,
        firstName: user.firstName || nameParts[0] || '',
        lastName: user.lastName || nameParts[1] || '',
        email: user.email,
        company: '',
        profilePhoto: user.avatar || null
      });
    }
    
    const sessionData = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      avatar: profile.profilePhoto || user.avatar,
      role: user.role
    };
    
    const response = NextResponse.json(
      { 
        success: true, 
        message: "Sign in successful",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          avatar: profile.profilePhoto || user.avatar,
          role: user.role
        }
      },
      { status: 200 }
    );
    
    response.cookies.set('user_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });
    
    return response;
    
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}