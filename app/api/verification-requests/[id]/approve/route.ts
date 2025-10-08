import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import VerificationRequest from '@/models/VerificationRequest'
import UserProfile from '@/models/userProfile'
import User from '@/models/user' 
import { sendApprovalEmail } from '@/lib/email'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }  // ← Changed signature
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
      
      console.log('Approval request for ID:', id)
      
      const verificationRequest = await VerificationRequest.findById(id)
      
      if (!verificationRequest) {
        return NextResponse.json(
          { success: false, error: 'Request not found' },
          { status: 404 }
        )
      }
      
      console.log('Found verification request:', verificationRequest._id)
      
      // Find existing user by email
      const existingUser = await User.findOne({ 
        email: verificationRequest.personalInfo.email 
      })
      
      if (!existingUser) {
        return NextResponse.json(
          { success: false, error: 'User not found in database' },
          { status: 404 }
        )
      }
      
      console.log('Found existing user:', existingUser._id)
      
      // Update or create user profile with the existing User's ObjectId
      let userProfile = await UserProfile.findOne({ userId: existingUser._id })
      
      if (!userProfile) {
        userProfile = await UserProfile.create({
          userId: existingUser._id,
          firstName: verificationRequest.personalInfo.fullName.split(' ')[0],
          lastName: verificationRequest.personalInfo.fullName.split(' ').slice(1).join(' ') || '',
          email: verificationRequest.personalInfo.email,
          company: verificationRequest.personalInfo.businessName,
          phone: verificationRequest.personalInfo.contactNumber,
          country: verificationRequest.personalInfo.country,
          industry: verificationRequest.personalInfo.industryType,
          businessRegistrationNumber: verificationRequest.personalInfo.businessRegistrationNumber,
        })
        console.log('User profile created:', userProfile._id)
      } else {
        // Update existing profile
        userProfile.firstName = verificationRequest.personalInfo.fullName.split(' ')[0]
        userProfile.lastName = verificationRequest.personalInfo.fullName.split(' ').slice(1).join(' ') || ''
        userProfile.company = verificationRequest.personalInfo.businessName
        userProfile.phone = verificationRequest.personalInfo.contactNumber
        userProfile.country = verificationRequest.personalInfo.country
        userProfile.industry = verificationRequest.personalInfo.industryType
        userProfile.businessRegistrationNumber = verificationRequest.personalInfo.businessRegistrationNumber
        await userProfile.save()
        console.log('User profile updated:', userProfile._id)
      }
      
      // Update verification request
      verificationRequest.verificationStatus = 'approved'
      verificationRequest.reviewedAt = new Date()
      verificationRequest.reviewedBy = 'admin'
      verificationRequest.userProfileId = userProfile._id
      await verificationRequest.save()
      
      console.log('Verification request updated to approved')
      
      // Send approval email
      console.log('Sending approval email...')
      const emailResult = await sendApprovalEmail(
        verificationRequest.personalInfo.email,
        verificationRequest.personalInfo.fullName
      )
      
      if (!emailResult.success) {
        console.error('Failed to send approval email:', emailResult.error)
        return NextResponse.json({
          success: true,
          message: 'Verification request approved, but email notification failed',
          userProfileId: userProfile._id,
          emailError: emailResult.error,
          warning: 'User was approved but may not have received email notification'
        })
      }
      
      console.log('Approval email sent successfully')
      
      return NextResponse.json({
        success: true,
        message: 'Verification request approved and email sent',
        userProfileId: userProfile._id,
        userId: existingUser._id
      })
    } catch (error: any) {
    console.error('DETAILED Error approving request:', error)
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to approve request',
        details: error.message
      },
      { status: 500 }
    )
  }
}