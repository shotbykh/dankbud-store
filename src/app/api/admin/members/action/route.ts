import { NextResponse } from "next/server";
import { updateMemberStatus } from "@/lib/db";
import { verifyAdminRequest } from "@/lib/admin-auth";

export async function POST(request: Request) {
    try {
        // SECURITY CHECK - Uses Supabase Auth (same as proxy.ts)
        const auth = await verifyAdminRequest();
        if (!auth.valid) {
            console.error('Admin auth failed:', auth.error);
            return NextResponse.json({ success: false, message: auth.error }, { status: 401 });
        }

        const body = await request.json();
        const { memberId, status } = body;

        if (!memberId || !status) {
            return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
        }

        console.log('Updating member status:', memberId, 'to', status);
        const updated = await updateMemberStatus(memberId, status);
        console.log('Update result:', updated);
        
        return NextResponse.json({ success: true, member: updated });
    } catch (e: any) {
        console.error('Member action error:', e);
        return NextResponse.json({ success: false, message: e.message || "Update failed" }, { status: 500 });
    }
}
