import { NextRequest, NextResponse } from 'next/server';
import { getSession, clearSessionCookie, deleteSession } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (session) {
      const cookieStore = await cookies();
      const token = cookieStore.get('session_token')?.value;
      if (token) {
        await deleteSession(token);
      }
    }

    await clearSessionCookie();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json(
      { error: 'Failed to log out' },
      { status: 500 }
    );
  }
}

