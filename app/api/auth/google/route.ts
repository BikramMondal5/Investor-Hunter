// app/api/auth/google/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role'); // Get role if passed from sign-in flow
  
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    redirect_uri: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/callback/google`,
    scope: 'openid profile email',
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    ...(role && { state: role }) // Pass role as state parameter
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?${params}`;
  return NextResponse.redirect(googleAuthUrl);
}