import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('user_session')?.value;
   
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please login first' },
        { status: 401 }
      )
    }
   
    const sessionData = JSON.parse(sessionCookie);
    const formData = await request.formData()
   
    // Extract pitch data
    const pitchData = {
      fullName: formData.get('fullName') as string,
      startupName: formData.get('startupName') as string,
      oneLiner: formData.get('oneLiner') as string,
      videoUrl: formData.get('videoUrl') as string,
      industry: formData.get('industry') as string,
      location: formData.get('location') as string,
      stage: formData.get('stage') as string,
      email: formData.get('email') as string,
      isPublic: formData.get('public') === 'on'
    }

    // Validate required fields
    if (!pitchData.videoUrl || !pitchData.startupName || !pitchData.email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Store pitch data in enhanced session cookie (don't save to database yet)
    const enhancedSession = {
      ...sessionData,
      pitchData: pitchData,
      pitchSubmittedAt: new Date().toISOString()
    }

    const response = NextResponse.json({
      success: true,
      message: 'Pitch data saved. Please complete document verification.'
    })

    // Update session cookie with pitch data
    response.cookies.set('user_session', JSON.stringify(enhancedSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    return response
   
  } catch (error: any) {
    console.error('Error saving pitch data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save pitch data', details: error.message },
      { status: 500 }
    )
  }
}