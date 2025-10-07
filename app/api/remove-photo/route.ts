import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserProfile from '@/models/userProfile';

export async function POST(req: NextRequest) {
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
    
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId: userId },
      { $unset: { profilePhoto: "" } },
      { new: true }
    );

    return NextResponse.json({ profile: updatedProfile }, { status: 200 });
  } catch (error) {
    console.error('Photo removal error:', error);
    return NextResponse.json({ error: 'Failed to remove photo' }, { status: 500 });
  }
}