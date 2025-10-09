import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import SavedPitch from '@/models/savedPitch'
import User from '@/models/user'

async function connectDB() {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.DATABASE_URL as string)
  }
}

// GET saved pitches for logged-in investor
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

    const savedPitches = await SavedPitch.find({ investorId: sessionData.userId })
      .populate('pitchId')
      .sort({ savedAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      pitches: savedPitches || []
    }, { status: 200 })

  } catch (error: any) {
    console.error('Error fetching saved pitches:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch saved pitches' },
      { status: 500 }
    )
  }
}

// POST to save/unsave a pitch
export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('user_session')?.value
    
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const sessionData = JSON.parse(sessionCookie)
    const { pitchId, entrepreneurId, action } = await request.json()

    if (!pitchId || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await connectDB()

    if (action === 'save') {
      // Check if already saved
      const existing = await SavedPitch.findOne({
        investorId: sessionData.userId,
        pitchId
      })

      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Pitch already saved' },
          { status: 400 }
        )
      }

      const savedPitch = await SavedPitch.create({
        investorId: sessionData.userId,
        pitchId,
        entrepreneurId
      })

      return NextResponse.json({
        success: true,
        message: 'Pitch saved successfully',
        data: savedPitch
      }, { status: 201 })

    } else if (action === 'unsave') {
      await SavedPitch.deleteOne({
        investorId: sessionData.userId,
        pitchId
      })

      return NextResponse.json({
        success: true,
        message: 'Pitch removed from saved'
      }, { status: 200 })
    }

  } catch (error: any) {
    console.error('Error saving pitch:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save pitch' },
      { status: 500 }
    )
  }
}