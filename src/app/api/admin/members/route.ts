import { NextResponse } from "next/server";
import { getMembers } from "@/lib/db";
import { verifyAdminRequest } from "@/lib/admin-auth";

// Force dynamic to prevent caching of member list
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const auth = await verifyAdminRequest();
        if (!auth.valid) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const members = await getMembers();
        // Sort by joinedAt descending
        const sorted = members.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());
        return NextResponse.json({ members: sorted });
    } catch (e) {
        console.error("Error fetching members:", e);
        return NextResponse.json({ members: [] }, { status: 500 });
    }
}
