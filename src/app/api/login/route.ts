import { NextResponse } from "next/server";
import { getMembers } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password } = body; // identifier = email or id number

    if (!identifier || !password) {
        return NextResponse.json({ success: false, message: "Missing credentials." }, { status: 400 });
    }

    const members = await getMembers();
    
    // Find member by Email OR ID Number
    const member = members.find(m => 
        (m.email.toLowerCase() === identifier.toLowerCase() || 
         m.idNumber === identifier)
    );

    if (!member) {
        return NextResponse.json({ success: false, message: "Invalid credentials." }, { status: 401 });
    }

    // Verify Password
    // Use verifyPassword which handles bcrypt comparison
    // Note: If stored password is plaintext (legacy), this will FAIL with bcrypt.compare.
    // This effectively forces a reset for users or mandates manual updates.
    // Given pre-launch status, this correct 'secure-by-default' approach.
    
    const isValid = member.password && await verifyPassword(password, member.password);

    if (!isValid) {
         return NextResponse.json({ success: false, message: "Invalid credentials." }, { status: 401 });
    }

    if (member.status !== 'APPROVED') {
         return NextResponse.json({ success: false, message: "Membership pending approval." }, { status: 403 });
    }

    // Login Success
    return NextResponse.json({ success: true, member });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}
