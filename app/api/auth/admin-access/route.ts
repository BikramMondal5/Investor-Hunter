import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { passkey } = await request.json();
    
    // Validate passkey is provided
    if (!passkey || !passkey.trim()) {
      return NextResponse.json(
        { success: false, message: 'Please enter a passkey' },
        { status: 400 }
      );
    }
    
    // Check passkey against environment variable
    if (passkey !== process.env.ADMIN_PASSKEY) {
      return NextResponse.json(
        { success: false, message: 'Invalid admin passkey' },
        { status: 403 }
      );
    }
    
    // Create admin session
    const adminSession = {
      userId: 'admin',
      role: 'admin',
      email: 'admin@investorhunt.com',
      name: 'Admin',
      isAdmin: true
    };
    
    const response = NextResponse.json({ 
      success: true, 
      message: 'Admin access granted' 
    });
    
    // Set admin session cookie
    response.cookies.set('user_session', JSON.stringify(adminSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });
    
    return response;
    
  } catch (error) {
    console.error('Admin access error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error occurred. Please try again.' },
      { status: 500 }
    );
  }
}