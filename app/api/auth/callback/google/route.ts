// app/api/auth/callback/google/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/user';

async function connectDB() {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.DATABASE_URL as string);
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
   
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    
    if (error || !code) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(new URL('/?error=oauth_failed', request.url));
    }
    
    // Exchange code for tokens
    const tokenParams = new URLSearchParams();
    tokenParams.append('client_id', process.env.GOOGLE_CLIENT_ID as string);
    tokenParams.append('client_secret', process.env.GOOGLE_CLIENT_SECRET as string);
    tokenParams.append('code', code);
    tokenParams.append('grant_type', 'authorization_code');
    tokenParams.append('redirect_uri', `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/callback/google`);
    
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams,
    });
    
    const tokens = await tokenResponse.json();
   
    if (!tokens.access_token) {
      throw new Error('Failed to get access token');
    }
    
    // Get user info from Google
    const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokens.access_token}`);
    const googleUser = await userResponse.json();
    
    // Check if user exists or create new user
    let user = await User.findOne({
      $or: [
        { googleId: googleUser.id },
        { email: googleUser.email }
      ]
    });
    
    if (!user) {
      // Create new user
      user = new User({
        googleId: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.picture,
        provider: 'google',
        isActive: true,
        lastLogin: new Date()
      });
      await user.save();
    } else {
      // Update existing user
      user.lastLogin = new Date();
      if (!user.googleId) user.googleId = googleUser.id;
      if (!user.avatar) user.avatar = googleUser.picture;
      await user.save();
    }
    
    // Create session data
    const sessionData = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      avatar: user.avatar
    };
    
    // Create redirect response to dashboard
    const response = NextResponse.redirect(new URL('/dashboard', request.nextUrl.origin));
   
    // Set session cookie
    response.cookies.set('user_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });
    
    console.log('Redirecting to:', `/dashboard`);
    
    return response;
    
  } catch (error) {
    console.error('OAuth callback error:', error);
    const origin = request.nextUrl.origin;
    return NextResponse.redirect(`${origin}/?error=oauth_failed`);
  }
}