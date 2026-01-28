import { NextResponse } from 'next/server';
import { getAuditLogs } from '@/lib/db';
import { verifyAdminRequest } from '@/lib/admin-auth';

// Force dynamic to prevent caching
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const auth = await verifyAdminRequest();
    if (!auth.valid) {
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
