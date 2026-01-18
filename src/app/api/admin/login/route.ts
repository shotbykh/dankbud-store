import { NextResponse } from "next/server";
import { getMembers, logAdminAction } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const members = await getMembers();
    
    // 1. Find member
    const member = members.find(m => m.email.toLowerCase() === email.toLowerCase());

    if (!member) {
        return NextResponse.json({ success: false, message: "Invalid credentials." }, { status: 401 });
    }

    // 2. Verify Password (HASHED)
    const isValid = member.password && await verifyPassword(password, member.password);
    
    if (!isValid) {
         return NextResponse.json({ success: false, message: "Invalid credentials." }, { status: 401 });
    }

    // 3. Verify ROLE (Critical Security Check)
    const allowedRoles = ['ADMIN', 'STAFF'];
    if (!member.role || !allowedRoles.includes(member.role)) {
         return NextResponse.json({ success: false, message: "Access Denied: Staff only." }, { status: 403 });
    }

    // 4. Set Session Cookie (Secure, HTTP Only)
    // We store minimal info: ID and Role
    const sessionData = JSON.stringify({
        id: member.id,
        role: member.role,
        name: member.fullName
    });

    const cookieStore = await cookies();
    cookieStore.set('admin_session', sessionData, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 1 day
    });

    // 5. Audit Log the Login
    await logAdminAction(member.id, 'LOGIN', { ip: 'unknown' });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Admin Login Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}
