import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

/**
 * GET /api/items
 * Fetch all items from Firestore
 */
export async function GET(request: NextRequest) {
  try {
    const itemsRef = collection(db, "items");
    const q = query(itemsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt:
        doc.data().createdAt?.toDate?.().toISOString() ||
        new Date().toISOString(),
    }));

    return NextResponse.json({ success: true, data: items }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
