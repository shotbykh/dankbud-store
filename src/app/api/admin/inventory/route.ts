import { NextResponse } from "next/server";
import { updateStock } from "@/lib/inventory";
import { verifyAdminRequest } from "@/lib/admin-auth";

export async function POST(request: Request) {
    try {
        const auth = await verifyAdminRequest();
        if (!auth.valid) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, stock } = await request.json();
        await updateStock(id, stock);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
