import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import VerificationRequest from '@/models/VerificationRequest'
import UserProfile from '@/models/userProfile'
import User from '@/models/user' 
import { sendApprovalEmail } from '@/lib/email'

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
      
      const { id } = await params
      const { pitchScore } = await request.json()
      
      if (!pitchScore || pitchScore < 1 || pitchScore > 10) {
        return NextResponse.json(
          { success: false, error: 'Pitch score must be between 1 and 10' },
          { status: 400 }
        )
      }
      
      await dbConnect()
      
      console.log('Approval request for ID:', id, 'with score:', pitchScore)
      
      const verificationRequest = await VerificationRequest.findById(id)
      
      if (!verificationRequest) {
        return NextResponse.json(
          { success: false, error: 'Request not found' },
          { status: 404 }
        )
      }
      
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
      
      // Update or create user profile
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
      } else {
        userProfile.firstName = verificationRequest.personalInfo.fullName.split(' ')[0]
        userProfile.lastName = verificationRequest.personalInfo.fullName.split(' ').slice(1).join(' ') || ''
        userProfile.company = verificationRequest.personalInfo.businessName
        userProfile.phone = verificationRequest.personalInfo.contactNumber
        userProfile.country = verificationRequest.personalInfo.country
        userProfile.industry = verificationRequest.personalInfo.industryType
        userProfile.businessRegistrationNumber = verificationRequest.personalInfo.businessRegistrationNumber
        await userProfile.save()
      }
      
      // Update verification request with pitch score
      verificationRequest.verificationStatus = 'approved'
      verificationRequest.pitchScore = pitchScore // Store the pitch score
      verificationRequest.reviewedAt = new Date()
      verificationRequest.reviewedBy = 'admin'
      verificationRequest.userProfileId = userProfile._id
      await verificationRequest.save()
      
      // Send approval email
      const emailResult = await sendApprovalEmail(
        verificationRequest.personalInfo.email,
        verificationRequest.personalInfo.fullName
      )
      
      if (!emailResult.success) {
        console.error('Failed to send approval email:', emailResult.error)
      }
      
      return NextResponse.json({
        success: true,
        message: 'Verification request approved and pitch scored',
        userProfileId: userProfile._id,
        userId: existingUser._id,
        pitchScore: pitchScore
      })
    } catch (error: any) {
      console.error('Error approving request:', error)
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