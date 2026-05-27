import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    const adminSecret = process.env.ADMIN_SECRET || 'admin123';

    if (!password || password !== adminSecret) {
      return NextResponse.json(
        { error: 'Invalid admin password' },
        { status: 401 }
      );
    }

    // Return a simple token (the password itself, validated on each request)
    return NextResponse.json({
      token: adminSecret,
      message: 'Login successful',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}