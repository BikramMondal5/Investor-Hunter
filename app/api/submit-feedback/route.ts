import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Testimonial from '@/models/testimonial'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    
    // Get user from session
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('user_session')?.value

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    let sessionData
    try {
      sessionData = JSON.parse(sessionCookie)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    // Fetch user from database
    const User = (await import('@/models/user')).default
    const user = await User.findById(sessionData.userId).select('name email role')

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const body = await req.json()
    const { feedback } = body

    // Validate feedback
    if (!feedback) {
      return NextResponse.json(
        { error: 'Feedback is required' },
        { status: 400 }
      )
    }

    // Fetch user profile for avatar
    const UserProfile = (await import('@/models/userProfile')).default
    const userProfile = await UserProfile.findOne({ userId: user._id })

    // Create feedback document with user's data
    const testimonial = await Testimonial.create({
      name: user.name,
      country: 'India', // Default country as requested
      type: user.role === 'investor' ? 'Investor' : 'Entrepreneur',
      feedback,
      avatar: userProfile?.profilePhoto || '/placeholder.svg',
      approved: true, // Auto-approve for now
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Feedback submitted successfully',
        id: testimonial._id 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error submitting feedback:', error)
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    // Get only approved feedbacks
    const feedbacks = await Testimonial
      .find({ approved: true })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(
      { success: true, feedbacks },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching feedbacks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedbacks' },
      { status: 500 }
    )
  }
}
