import { NextResponse } from 'next/server';
import { getAuditLogs } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // 1. Security Check: Ensure requester is an Admin/Staff
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');

    if (!adminSession) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const logs = await getAuditLogs();
    
    // Add caching headers to prevent stale data
    return NextResponse.json({ logs }, {
        headers: {
            'Cache-Control': 'no-store, max-age=0'
        }
    });

  } catch (error) {
    console.error("Audit API Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch logs' }, { status: 500 });
  }
}
