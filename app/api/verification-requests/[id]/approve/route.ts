import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import VerificationRequest from '@/models/VerificationRequest'
import UserProfile from '@/models/userProfile'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    
    const { id } = params
    const { adminId } = await request.json()
    
    // Find the verification request
    const verificationRequest = await VerificationRequest.findById(id)
    
    if (!verificationRequest) {
      return NextResponse.json(
        { success: false, error: 'Request not found' },
        { status: 404 }
      )
    }

    // Create the actual user profile ONLY after admin approval
    const userProfile = await UserProfile.create({
      userId: verificationRequest.personalInfo.userId, // Assuming this was linked earlier
      firstName: verificationRequest.personalInfo.fullName.split(' ')[0],
      lastName: verificationRequest.personalInfo.fullName.split(' ')[1] || '',
      email: verificationRequest.personalInfo.email,
      company: verificationRequest.personalInfo.businessName,
      // ... other fields
    })

    // Update verification request status
    verificationRequest.verificationStatus = 'approved'
    verificationRequest.reviewedAt = new Date()
    verificationRequest.reviewedBy = adminId
    verificationRequest.userProfileId = userProfile._id
    await verificationRequest.save()

    // Send approval email to user
    // await sendApprovalEmail(verificationRequest.personalInfo.email)

    return NextResponse.json({
      success: true,
      message: 'Verification request approved',
      userProfileId: userProfile._id
    })
    
  } catch (error) {
    console.error('Error approving verification request:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to approve request' },
      { status: 500 }
    )
  }
}