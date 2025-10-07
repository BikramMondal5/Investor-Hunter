import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import VerificationRequest from '@/models/VerificationRequest'

export async function GET() {
  try {
    await dbConnect()
    const requests = await VerificationRequest.find({ verificationStatus: 'pending' })
      .sort({ submittedAt: -1 })
    
    return NextResponse.json({ success: true, requests })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch requests' }, { status: 500 })
  }
}