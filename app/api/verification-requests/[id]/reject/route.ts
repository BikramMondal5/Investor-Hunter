import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import VerificationRequest from '@/models/VerificationRequest'
import { sendRejectionEmail } from '@/lib/email'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionCookie = request.cookies.get('user_session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - No session' },
        { status: 401 }
      )
    }
    
    const sessionData = JSON.parse(sessionCookie);
    
    if (sessionData.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }
    
    await dbConnect()
    
    const { id } = await params
    const body = await request.json()
    const { rejectionReason } = body
    
    console.log('Rejection request for ID:', id)
    console.log('Rejection reason:', rejectionReason)
    
    const verificationRequest = await VerificationRequest.findById(id)
    
    if (!verificationRequest) {
      console.log('Verification request not found')
      return NextResponse.json({ 
        success: false, 
        error: 'Request not found' 
      }, { status: 404 })
    }
    
    console.log('Found verification request:', verificationRequest._id)
    
    // Update verification request
    verificationRequest.verificationStatus = 'rejected'
    verificationRequest.rejectionReason = rejectionReason
    verificationRequest.reviewedAt = new Date()
    verificationRequest.reviewedBy = 'admin'
    
    console.log('About to save verification request...')
    await verificationRequest.save()
    console.log('Verification request saved successfully')
    
    // Send rejection email
    console.log('Sending rejection email...')
    const emailResult = await sendRejectionEmail(
      verificationRequest.personalInfo.email,
      verificationRequest.personalInfo.fullName,
      rejectionReason
    )
    
    if (!emailResult.success) {
      console.error('Failed to send rejection email:', emailResult.error)
      // Return success with warning about email
      return NextResponse.json({ 
        success: true, 
        message: 'Request rejected, but email notification failed',
        emailError: emailResult.error,
        warning: 'User was rejected but may not have received email notification'
      })
    }
    
    console.log('Rejection email sent successfully')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Request rejected and email sent successfully' 
    })
    
  } catch (error: any) {
    console.error('DETAILED Error rejecting request:', error)
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to reject request',
      details: error.message
    }, { status: 500 })
  }
} 