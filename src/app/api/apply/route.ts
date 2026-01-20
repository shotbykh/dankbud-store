import { NextResponse } from 'next/server';
import { parseSAID } from "@/lib/utils";
import { saveMember } from "@/lib/db";
import { EmailService } from '@/lib/email';

// Simple UUID polyfill if needed, or just use random string
function generateId() {
    return Math.random().toString(36).substring(2, 15);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // ... validation logic ...
        const { fullName, idNumber, email, phone } = body;

        // Save to DB
        await saveMember({
            id: generateId(),
            fullName: fullName,
            idNumber: idNumber,
            email,
            phone,
            status: 'PENDING',
            joinedAt: new Date().toISOString(),
            totalSpent: 0
        });

        // Notify Staff
        await EmailService.sendStaffNotification(
            "New Member Application",
            `New applicant: ${fullName} (${idNumber}). Please review in Admin Console.`
        );

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Apply Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
