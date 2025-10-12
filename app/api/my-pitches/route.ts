import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import VerificationRequest from '@/models/VerificationRequest'

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('user_session')?.value;
   
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
   
    const sessionData = JSON.parse(sessionCookie);
    const userEmail = sessionData.email;
    
    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: 'User email not found' },
        { status: 400 }
      )
    }
    
    await dbConnect()
   
    // Fetch only APPROVED pitches for this user by email
    const approvedPitches = await VerificationRequest.find({
      'personalInfo.email': userEmail,
      verificationStatus: 'approved'
    })
    .sort({ submittedAt: -1 })
    .lean()
   
    return NextResponse.json({
      success: true,
      pitches: approvedPitches
    })
   
  } catch (error: any) {
    console.error('Error fetching pitches:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch pitches',
        details: error.message
      },
      { status: 500 }
    )
  }
}