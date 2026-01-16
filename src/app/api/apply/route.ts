import { NextResponse } from "next/server";
import { parseSAID } from "@/lib/utils";
import { saveMember } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

// Simple UUID polyfill if needed, or just use random string
function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, idNumber, password } = body;

    // 1. Verify Age
    const { age, isValid } = parseSAID(idNumber);

    if (!isValid) {
        return NextResponse.json({ success: false, message: "Invalid ID Number format." }, { status: 400 });
    }

    if (age < 18) {
        return NextResponse.json({ success: false, message: "You must be 18 or older to join." }, { status: 403 });
    }

    if (!password || password.length < 6) {
        return NextResponse.json({ success: false, message: "Password must be at least 6 characters." }, { status: 400 });
    }

    // 2. Auto-Approve & Save
    const newMember = {
        id: generateId(),
        fullName,
        email,
        phone,
        idNumber,
        status: "APPROVED" as const,
        joinedAt: new Date().toISOString(),
        totalSpent: 0,
        password // Storing plain text for MVP (Prototype only) - DO NOT DO THIS IN PROD
    };

    try {
        saveMember(newMember);
    } catch (e) {
        return NextResponse.json({ success: false, message: "Member already exists." }, { status: 409 });
    }

    // 3. Simulate "Immediate Email" (Log it)
    console.log(`[EMAIL SENT] To: ${email} | Subject: Welcome to DankBud | Access Granted`);

    // 4. Return Session Token (Simulated)
    // In a real app, we'd set an HTTP-only cookie here.
    return NextResponse.json({ success: true, member: newMember });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
