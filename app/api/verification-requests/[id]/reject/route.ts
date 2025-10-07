import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import VerificationRequest from '@/models/VerificationRequest'
import { sendRejectionEmail } from '@/lib/email'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    
    const { id } = await params
    const { adminId, rejectionReason } = await request.json()
    
    const verificationRequest = await VerificationRequest.findById(id)
    
    if (!verificationRequest) {
      return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 })
    }
    
    verificationRequest.verificationStatus = 'rejected'
    verificationRequest.rejectionReason = rejectionReason
    verificationRequest.reviewedAt = new Date()
    verificationRequest.reviewedBy = adminId
    await verificationRequest.save()
    await sendRejectionEmail(
        verificationRequest.personalInfo.email,
        verificationRequest.personalInfo.fullName,
        rejectionReason
        )
    
    // TODO: Send rejection email
    // await sendRejectionEmail(verificationRequest.personalInfo.email, rejectionReason)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Request rejected successfully' 
    })
  } catch (error) {
    console.error('Error rejecting request:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to reject request' 
    }, { status: 500 })
  }
}