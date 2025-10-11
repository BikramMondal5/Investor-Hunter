import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import VerificationRequest from '@/models/VerificationRequest'

async function connectDB() {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.DATABASE_URL as string)
  }
}

export async function GET() {
  try {
    // Ensure database is connected
    await connectDB()
   
    // Fetch ALL approved pitches from ALL users with pitch score
    const approvedPitches = await VerificationRequest.find({
      verificationStatus: 'approved'
    })
    .select('personalInfo pitchData pitchScore submittedAt')
    .sort({ submittedAt: -1 })
    .lean()
    .exec()
   
    // Map to include pitchScore in pitchData for easy access in frontend
    const enrichedPitches = approvedPitches.map((pitch: any) => ({
      ...pitch,
      pitchData: {
        ...pitch.pitchData,
        pitchScore: pitch.pitchScore || null
      }
    }))
   
    return NextResponse.json({
      success: true,
      pitches: enrichedPitches || []
    }, { status: 200 })
   
  } catch (error: any) {
    console.error('Error fetching approved pitches:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch pitches',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}