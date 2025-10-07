import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserProfile from '@/models/userProfile';
import User from '@/models/user'; // Assuming you have a User model

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('user_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const sessionData = JSON.parse(sessionCookie);
    const userId = sessionData?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    let profile = await UserProfile.findOne({ userId: userId });
    
    // Create profile if it doesn't exist
    if (!profile) {
        const user = await User.findById(userId);
        if (user) {
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
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('user_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const sessionData = JSON.parse(sessionCookie);
    const userId = sessionData?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, email, company, profilePhoto, notifications } = body;

    await dbConnect();
    
    const profile = await UserProfile.findOneAndUpdate(
      { userId: userId },
      {
        firstName,
        lastName,
        email,
        company,
        ...(profilePhoto && { profilePhoto }),
        ...(notifications && { notifications })
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

