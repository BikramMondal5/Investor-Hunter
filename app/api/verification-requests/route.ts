import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import VerificationRequest from '@/models/VerificationRequest'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
   
    const data = await request.json()
   
    // Create verification request
    const verificationRequest = await VerificationRequest.create({
      ...data,
      verificationStatus: 'pending',
      submittedAt: new Date()
    })
    
    // TODO: Send email notification to admin
    // await sendAdminNotification(verificationRequest._id)
    
    return NextResponse.json({
      success: true,
      requestId: verificationRequest._id,
      message: 'Verification request submitted successfully. You will be notified once approved.'
    })
   
  } catch (error) {
    console.error('Error creating verification request:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit verification request' },
      { status: 500 }
    )
  }
}

