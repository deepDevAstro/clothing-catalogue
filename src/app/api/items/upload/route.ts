import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/items/upload
 *
 * Validate and store pre-compressed base64 image (for Firestore storage)
 * NOTE: Compression happens on CLIENT side in AdminForm component
 * This endpoint just validates the compressed data
 *
 * Request body (JSON):
 *   - base64: Pre-compressed base64 data URL from client
 *
 * Response:
 *   - base64: The validated base64 data URL (to store in Firestore)
 *   - compressedSize: Size of base64 string in bytes
 *   - compressedSizeFormatted: Human-readable size
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { base64 } = body;

    if (!base64) {
      return NextResponse.json(
        { success: false, error: "No base64 data provided" },
        { status: 400 }
      );
    }

    if (typeof base64 !== "string") {
      return NextResponse.json(
        { success: false, error: "base64 must be a string" },
        { status: 400 }
      );
    }

    if (!base64.startsWith("data:image/")) {
      return NextResponse.json(
        { success: false, error: "Invalid base64 format - must be data URL" },
        { status: 400 }
      );
    }

    // Check compressed size (should already be compressed on client)
    const compressedSize = base64.length;
    const maxCompressedSize = 900 * 1024; // 900KB safety margin

    if (compressedSize > maxCompressedSize) {
      return NextResponse.json(
        {
          success: false,
          error: `Image data is ${formatFileSize(
            compressedSize
          )}, exceeds 900KB limit. Please use a smaller image.`,
        },
        { status: 413 }
      );
    }

    // Return the validated base64
    return NextResponse.json(
      {
        success: true,
        data: {
          base64,
          compressedSize,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error validating image:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to validate image" },
      { status: 500 }
    );
  }
}

// Helper function
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
