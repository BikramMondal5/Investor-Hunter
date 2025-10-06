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
    const state = searchParams.get('state'); // Get role from state parameter
   
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
   
    // Check if user exists
    let user = await User.findOne({
      $or: [
        { googleId: googleUser.id },
        { email: googleUser.email }
      ]
    });

    let userRole = 'entrepreneur'; // default role
    let isNewUser = false;

    // ⭐ NEW: Check if this is a sign-in attempt (no state/role parameter)
    const isSignUpFlow = state !== null && state !== undefined && state !== '';

    if (!user) {
      // ⭐ NEW: If user doesn't exist and this is a sign-in flow, reject
      if (!isSignUpFlow) {
        return NextResponse.redirect(new URL('/?error=user_not_found', request.url));
      }

      // New user - only allow in sign-up flow
      userRole = state || 'entrepreneur';
      isNewUser = true;
      
      // Parse name into first and last name
      const nameParts = googleUser.name.split(' ');
      const firstName = nameParts[0] || googleUser.name;
      const lastName = nameParts.slice(1).join(' ') || '';

      user = new User({
        googleId: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        firstName,
        lastName,
        avatar: googleUser.picture,
        provider: 'google',
        role: userRole,
        isActive: true,
      });
      await user.save();
    } else {
      // Existing user - use their existing role
      userRole = user.role;
      
      // Update Google ID and avatar if missing
      if (!user.googleId) {
        user.googleId = googleUser.id;
      }
      if (!user.avatar) {
        user.avatar = googleUser.picture;
      }
      user.lastLogin = new Date();
      await user.save();
    }
   
    // Create session data
    const sessionData = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role
    };
   
    // Redirect based on role
    const redirectPath = userRole === 'investor' ? '/investor' : '/dashboard';
    const successParam = isNewUser ? 'registered' : 'signin';
    const response = NextResponse.redirect(new URL(`${redirectPath}?${successParam}=true`, request.nextUrl.origin));
   
    // Set session cookie
    response.cookies.set('user_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });
   
    console.log('Redirecting to:', redirectPath);
   
    return response;
   
  } catch (error) {
    console.error('OAuth callback error:', error);
    const origin = request.nextUrl.origin;
    return NextResponse.redirect(`${origin}/?error=oauth_failed`);
  }
}