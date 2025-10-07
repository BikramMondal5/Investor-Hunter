import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import VerificationRequest from '@/models/VerificationRequest'
import UserProfile from '@/models/userProfile'
import { sendApprovalEmail } from '@/lib/email'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
   
    const { id } = await params
    const { adminId } = await request.json()
   
    const verificationRequest = await VerificationRequest.findById(id)
   
    if (!verificationRequest) {
      return NextResponse.json(
        { success: false, error: 'Request not found' },
        { status: 404 }
      )
    }
    
    // Create the actual user profile
    const userProfile = await UserProfile.create({
      firstName: verificationRequest.personalInfo.fullName.split(' ')[0],
      lastName: verificationRequest.personalInfo.fullName.split(' ').slice(1).join(' ') || '',
      email: verificationRequest.personalInfo.email,
      company: verificationRequest.personalInfo.businessName,
      phone: verificationRequest.personalInfo.contactNumber,
      country: verificationRequest.personalInfo.country,
      industry: verificationRequest.personalInfo.industryType,
      businessRegistrationNumber: verificationRequest.personalInfo.businessRegistrationNumber,
    })
    
    // Update verification request
    verificationRequest.verificationStatus = 'approved'
    verificationRequest.reviewedAt = new Date()
    verificationRequest.reviewedBy = adminId
    verificationRequest.userProfileId = userProfile._id
    await verificationRequest.save()
    await sendApprovalEmail(
        verificationRequest.personalInfo.email,
        verificationRequest.personalInfo.fullName
        )
    
    // TODO: Send approval email
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