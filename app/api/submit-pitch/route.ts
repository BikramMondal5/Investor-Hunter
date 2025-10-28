import { NextRequest, NextResponse } from 'next/server'

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
    
    // Parse JSON body instead of FormData
    const pitchData = await request.json()
    
    // Validate required fields
    if (!pitchData.videoUrl || !pitchData.startupName || !pitchData.email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Store pitch data in enhanced session cookie
    const enhancedSession = {
      ...sessionData,
      pitchData: {
        fullName: pitchData.fullName,
        startupName: pitchData.startupName,
        oneLiner: pitchData.oneLiner,
        videoUrl: pitchData.videoUrl,
        industry: pitchData.industry,
        location: pitchData.location,
        stage: pitchData.stage,
        email: pitchData.email,
        isPublic: pitchData.public === 'on'
      },
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