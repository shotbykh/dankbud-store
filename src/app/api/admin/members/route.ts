import { NextResponse } from "next/server";
import { getMembers } from "@/lib/db";

export async function GET() {
    // In a real app, verify Admin session here!
    const members = await getMembers();
    // Sort by joinedAt descending
    const sorted = members.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());
    return NextResponse.json({ members: sorted });
}
