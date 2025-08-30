import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userSession = cookieStore.get('user_session');

    if (!userSession) {
      return NextResponse.json({ authenticated: false });
    }

    const userData = JSON.parse(userSession.value);
    
    return NextResponse.json({
      authenticated: true,
      user: {
        id: userData.userId,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar
      }
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}