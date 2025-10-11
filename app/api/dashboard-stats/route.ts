import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import VerificationRequest from '@/models/VerificationRequest'
import Message from '@/models/message'

async function connectDB() {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.DATABASE_URL as string)
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('user_session')?.value
    
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const sessionData = JSON.parse(sessionCookie)
    await connectDB()

    // Count pitches submitted
    const pitchesSubmitted = await VerificationRequest.countDocuments({
      userProfileId: sessionData.userId
    })

    // Count pitches approved
    const pitchesApproved = await VerificationRequest.countDocuments({
      userProfileId: sessionData.userId,
      verificationStatus: 'approved'
    })

    // Count unread messages
    const unreadMessages = await Message.countDocuments({
      recipientId: new mongoose.Types.ObjectId(sessionData.userId),
      isRead: false
    })

    return NextResponse.json({
      success: true,
      pitchesSubmitted,
      pitchesApproved,
      unreadMessages
    }, { status: 200 })

  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}