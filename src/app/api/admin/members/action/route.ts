import { NextResponse } from "next/server";
import { updateMemberStatus } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        // SECURITY CHECK
        if (!await verifyAdminSession()) {
             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { memberId, status } = body;

        if (!memberId || !status) {
            return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
        }

        const updated = await updateMemberStatus(memberId, status);
        return NextResponse.json({ success: true, member: updated });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 });
    }
}
