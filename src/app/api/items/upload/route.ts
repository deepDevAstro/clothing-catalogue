import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/items/upload
 * Upload image as base64 and store directly in Firestore
 * Much simpler and more reliable than Firebase Storage REST API
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type. Only JPEG, PNG, and WebP allowed.",
        },
        { status: 400 }
      );
    }

    // Validate file size (2MB limit for base64 in Firestore)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "File size exceeds 2MB limit" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Return the data URL directly - this can be stored in Firestore or used directly in img tags
    return NextResponse.json(
      {
        success: true,
        data: {
          url: dataUrl,
          size: file.size,
          type: file.type,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process image" },
      { status: 500 }
    );
  }
}
