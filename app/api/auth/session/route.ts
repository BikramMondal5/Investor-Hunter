import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/user';
import UserProfile from '@/models/userProfile';

async function connectDB() {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.DATABASE_URL as string);
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('user_session')?.value;
   
    if (!sessionCookie) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
   
    const sessionData = JSON.parse(sessionCookie);
   
    // Handle admin session (no database user)
    if (sessionData.role === 'admin' && sessionData.userId === 'admin') {
      return NextResponse.json({
        user: {
          id: 'admin',
          email: 'admin@investorhunt.com',
          name: 'Admin',
          role: 'admin',
          avatar: null,
        },
        profile: null
      }, { status: 200 });
    }
   
    await connectDB();
   
    // Fetch full user data for regular users
    const user = await User.findById(sessionData.userId).select('-password');
   
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
   
    // Fetch or create user profile
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
   
    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: profile.profilePhoto || user.avatar,
      },
      profile: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        company: profile.company,
        profilePhoto: profile.profilePhoto,
        notifications: profile.notifications
      }
    }, { status: 200 });
   
  } catch (error) {
    console.error('Session fetch error:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}