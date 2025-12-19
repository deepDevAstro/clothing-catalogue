import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/login
 * Authenticate user (Firebase handles actual auth on client)
 * This endpoint is for reference and can be used for server-side operations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password required" },
        { status: 400 }
      );
    }

    // Authentication is handled on the client-side with Firebase
    // This is a reference endpoint
    return NextResponse.json(
      { success: true, message: "Use client-side Firebase authentication" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
