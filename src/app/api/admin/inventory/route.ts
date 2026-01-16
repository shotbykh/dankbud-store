import { NextResponse } from "next/server";
import { updateStock } from "@/lib/inventory";

export async function POST(request: Request) {
    try {
        const { id, stock } = await request.json();
        await updateStock(id, stock);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
