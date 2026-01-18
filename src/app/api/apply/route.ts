import { NextResponse } from "next/server";
import { parseSAID } from "@/lib/utils";
import { saveMember } from "@/lib/db";
import { sendStaffNotification } from '@/lib/email';

// Simple UUID polyfill if needed, or just use random string
function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function calculateAgeFromDob(dob: string) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, idNumber, password, idType, dateOfBirth } = body;

    // 1. Verify Age based on ID Type
    if (idType === 'PASSPORT') {
        if (!dateOfBirth) {
             return NextResponse.json({ success: false, message: "Date of Birth required for Passport." }, { status: 400 });
        }
        const age = calculateAgeFromDob(dateOfBirth);
        if (age < 18) {
            return NextResponse.json({ success: false, message: "You must be 18 or older to join." }, { status: 403 });
        }
    } else {
        // SA ID
        const { age, isValid } = parseSAID(idNumber);
        if (!isValid) {
            return NextResponse.json({ success: false, message: "Invalid SA ID Number format." }, { status: 400 });
        }
        if (age < 18) {
            return NextResponse.json({ success: false, message: "You must be 18 or older to join." }, { status: 403 });
        }
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
        idNumber, // Stores either SA ID or Passport Number
        status: "APPROVED" as const,
        joinedAt: new Date().toISOString(),
        totalSpent: 0,
        password 
    };

    try {
        await saveMember(newMember);
    } catch (e) {
        return NextResponse.json({ success: false, message: "Member already exists." }, { status: 409 });
    }

    // 3. Send Notification
    await sendStaffNotification(
        `New Member Joined: ${fullName}`,
        `<h1>New Member Alert 🚨</h1>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>ID:</strong> ${idNumber} (${idType || 'SA ID'})</p>
        <p><strong>Status:</strong> APPROVED</p>`
    );

    return NextResponse.json({ success: true, member: newMember });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
