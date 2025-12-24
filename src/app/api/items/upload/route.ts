import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/items/upload
 *
 * DEPRECATED - This endpoint is no longer used!
 *
 * Previously: Validated pre-compressed base64 images for Firestore storage
 *
 * NOW: Images are uploaded directly to Firebase Storage using:
 * - uploadImageToStorage() in src/lib/firebaseStorage.ts
 * - uploadMultipleImagesToStorage() in src/lib/firebaseStorage.ts
 *
 * This endpoint can be safely removed or kept for backward compatibility.
 *
 * See: FIRESTORE_ARCHITECTURE.md and FIREBASE_STORAGE_MIGRATION.md
 */
export async function POST(request: NextRequest) {
  try {
    return NextResponse.json(
      {
        success: false,
        error: "This endpoint is deprecated. Use Firebase Storage directly.",
        deprecated: true,
        migration: "See FIREBASE_STORAGE_MIGRATION.md for details",
      },
      { status: 410 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
