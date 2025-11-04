import { NextRequest, NextResponse } from 'next/server'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('user_session')?.value
   
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json() as HandleUploadBody

    try {
      const jsonResponse = await handleUpload({
        body,
        request,
        onBeforeGenerateToken: async (pathname) => {
          // Generate unique filename
          const sessionData = JSON.parse(sessionCookie)
          const timestamp = Date.now()
          const fileExtension = pathname.split('.').pop()
          
          return {
            allowedContentTypes: ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'],
            maximumSizeInBytes: 200 * 1024 * 1024, // 200MB limit
            tokenPayload: JSON.stringify({
              userId: sessionData.userId,
            }),
          }
        },
        onUploadCompleted: async ({ blob, tokenPayload }) => {
          console.log('Upload completed:', blob.url)
        },
      })

      return NextResponse.json(jsonResponse)
    } catch (error) {
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Error generating upload URL:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate upload URL' },
      { status: 500 }
    )
  }
}