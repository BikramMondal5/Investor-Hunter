import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('user_session')?.value;
   
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please login first' },
        { status: 401 }
      )
    }
   
    const formData = await request.formData()
    const videoFile = formData.get('video') as File
   
    if (!videoFile) {
      return NextResponse.json(
        { success: false, error: 'No video file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime']
    if (!allowedTypes.includes(videoFile.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only MP4, MOV, and AVI are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (200MB max)
    const maxSize = 200 * 1024 * 1024 // 200MB in bytes
    if (videoFile.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 200MB limit' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const sessionData = JSON.parse(sessionCookie)
    const fileExtension = videoFile.name.split('.').pop()
    const fileName = `pitch_${sessionData.userId}_${timestamp}.${fileExtension}`

    // Upload to Vercel Blob
    const blob = await put(fileName, videoFile, {
      access: 'public',
      addRandomSuffix: false,
    })

    return NextResponse.json({
      success: true,
      videoUrl: blob.url,
      message: 'Video uploaded successfully'
    })
  } catch (error: any) {
    console.error('Error uploading video:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload video',
        details: error.message
      },
      { status: 500 }
    )
  }
}