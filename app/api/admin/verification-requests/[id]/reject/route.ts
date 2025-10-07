import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import VerificationRequest from '@/models/VerificationRequest'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const { id } = params
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
    
    // TODO: Send rejection email
    
    return NextResponse.json({ success: true, message: 'Request rejected' })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to reject request' }, { status: 500 })
  }
}