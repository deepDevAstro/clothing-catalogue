import { NextRequest, NextResponse } from "next/server";
import { db, auth } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

/**
 * GET /api/items/[id]
 * Fetch a single item
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const itemRef = doc(db, "items", id);
    const itemSnap = await getDoc(itemRef);

    if (!itemSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: itemSnap.id,
          ...itemSnap.data(),
          createdAt: itemSnap.data().createdAt?.toDate?.().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching item:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/items/[id]
 * Update an item
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin auth (in production, use proper authentication)
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();

    const itemRef = doc(db, "items", id);
    const updateData = {
      ...body,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(itemRef, updateData);

    return NextResponse.json(
      { success: true, message: "Item updated" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating item:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/items/[id]
 * Delete an item
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin auth (in production, use proper authentication)
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    const itemRef = doc(db, "items", id);
    await deleteDoc(itemRef);

    return NextResponse.json(
      { success: true, message: "Item deleted" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
