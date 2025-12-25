import { NextRequest, NextResponse } from "next/server";

/**
 * DELETE /api/cloudinary/delete
 * Delete an image from Cloudinary using the Cloudinary API
 * Requires: CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in environment
 */
export async function POST(request: NextRequest) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { error: "publicId is required" },
        { status: 400 }
      );
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("Cloudinary API credentials not configured");
      return NextResponse.json(
        {
          error:
            "Cloudinary credentials not configured. Contact administrator.",
        },
        { status: 500 }
      );
    }

    // Prepare deletion signature (required by Cloudinary API)
    const timestamp = Math.floor(Date.now() / 1000);

    // Create signature: SHA-1 hash of "public_id={id}&timestamp={ts}{api_secret}"
    const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;

    // Use Node.js crypto to hash
    const crypto = await import("crypto");
    const signature = crypto
      .createHash("sha1")
      .update(signatureString)
      .digest("hex");

    // Call Cloudinary destroy API
    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("signature", signature);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());

    const deleteUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;
    const response = await fetch(deleteUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Cloudinary delete error:", error);
      return NextResponse.json(
        { error: error.error?.message || "Failed to delete image" },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete image from Cloudinary",
      },
      { status: 500 }
    );
  }
}
