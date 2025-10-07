import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import VerificationRequest from '@/models/VerificationRequest'

export async function GET() {
  try {
    await dbConnect()
    
    const requests = await VerificationRequest.find({ 
      verificationStatus: 'pending' 
    })
    .sort({ submittedAt: -1 })
    .lean()
    
    return NextResponse.json({ 
      success: true, 
      requests 
    })
  } catch (error) {
    console.error('Error fetching verification requests:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch requests',
      requests: [] 
    }, { status: 500 })
  }
}