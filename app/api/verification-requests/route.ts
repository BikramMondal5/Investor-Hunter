import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import VerificationRequest from '@/models/VerificationRequest'
import { sendAdminNotification } from '@/lib/email'

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
    
    // Check if pitch data exists in session
    if (!sessionData.pitchData) {
      return NextResponse.json(
        { success: false, error: 'Please submit your pitch video first' },
        { status: 400 }
      )
    }

    await dbConnect()
   
    const data = await request.json()
   
    // Combine pitch data from Step 1 (session) with registration data from Step 2
    const completeVerificationRequest = {
      personalInfo: {
        userId: sessionData.userId,
        fullName: data.personalInfo.fullName,
        businessName: data.personalInfo.businessName,
        email: data.personalInfo.email,
        contactNumber: data.personalInfo.contactNumber,
        businessRegistrationNumber: data.personalInfo.businessRegistrationNumber,
        industryType: data.personalInfo.industryType,
        country: data.personalInfo.country
      },
      pitchData: {
        videoUrl: sessionData.pitchData.videoUrl,
        startupName: sessionData.pitchData.startupName,
        oneLiner: sessionData.pitchData.oneLiner,
        industry: sessionData.pitchData.industry,
        location: sessionData.pitchData.location,
        stage: sessionData.pitchData.stage,
        isPublic: sessionData.pitchData.isPublic
      },
      documents: data.documents,
      verificationStatus: 'pending',
      submittedAt: new Date()
    }

    // Create single verification request with all combined data
    const verificationRequest = await VerificationRequest.create(completeVerificationRequest)

    // Send single admin notification
    try {
      await sendAdminNotification(
        verificationRequest._id.toString(),
        data.personalInfo.fullName
      )
      console.log('Admin notification sent successfully')
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError)
    }

    // Clear pitch data from session after successful submission
    const cleanedSession = {
      userId: sessionData.userId,
      email: sessionData.email,
      name: sessionData.name
    }

    const response = NextResponse.json({
      success: true,
      requestId: verificationRequest._id,
      message: 'Verification request submitted successfully. You will be notified once approved.'
    })

    // Update session cookie to remove pitch data
    response.cookies.set('user_session', JSON.stringify(cleanedSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
   
  } catch (error: any) {
    console.error('Error creating verification request:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit verification request', details: error.message },
      { status: 500 }
    )
  }
}