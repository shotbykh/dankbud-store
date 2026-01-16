import { NextResponse } from "next/server";
import { getMembers } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password } = body; // identifier = email or id number

    if (!identifier || !password) {
        return NextResponse.json({ success: false, message: "Missing credentials." }, { status: 400 });
    }

    const members = getMembers();
    
    // Find member by Email OR ID Number
    const member = members.find(m => 
        (m.email.toLowerCase() === identifier.toLowerCase() || 
         m.idNumber === identifier)
    );

    if (!member) {
        return NextResponse.json({ success: false, message: "Invalid credentials." }, { status: 401 });
    }

    // Verify Password
    // NOTE: In production, use bcrypt.compare here. 
    // This is MVP plaintext comparison as per plan.
    if (member.password !== password) {
         return NextResponse.json({ success: false, message: "Invalid credentials." }, { status: 401 });
    }

    if (member.status !== 'APPROVED') {
         return NextResponse.json({ success: false, message: "Membership pending approval." }, { status: 403 });
    }

    // Login Success
    // In production, set JWT cookie here.
    return NextResponse.json({ success: true, member });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}
