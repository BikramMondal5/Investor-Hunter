import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

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

    // Validate file size (100MB max)
    const maxSize = 100 * 1024 * 1024 // 100MB in bytes
    if (videoFile.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 100MB limit' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'videos')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const sessionData = JSON.parse(sessionCookie)
    const fileExtension = videoFile.name.split('.').pop()
    const fileName = `pitch_${sessionData.userId}_${timestamp}.${fileExtension}`
    const filePath = path.join(uploadsDir, fileName)

    // Convert file to buffer and save
    const bytes = await videoFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Return the public URL
    const videoUrl = `/uploads/videos/${fileName}`

    return NextResponse.json({
      success: true,
      videoUrl,
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