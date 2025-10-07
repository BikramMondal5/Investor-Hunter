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
    const formData = await req.formData();
    const file = formData.get('photo') as File;
    if (!file) {
      return NextResponse.json({ error: 'No photo provided' }, { status: 400 });
    }

    // Convert file to buffer and then to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    const mimeType = file.type;
    
    // Create data URL
    const photoUrl = `data:${mimeType};base64,${base64Image}`;
    
    await dbConnect();
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId: userId },
      { profilePhoto: photoUrl },
      { new: true, upsert: true }
    );
    
    return NextResponse.json({ profile: updatedProfile }, { status: 200 });
  } catch (error) {
    console.error('Photo upload error:', error);
    return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 });
  }
}