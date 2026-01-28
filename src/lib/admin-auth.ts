import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'shotbykh@gmail.com';

/**
 * Verifies if the current request is from an authenticated admin user.
 * Uses Supabase Auth (same as proxy.ts) for consistency.
 */
export async function verifyAdminRequest(): Promise<{ valid: boolean; error?: string }> {
    try {
        const cookieStore = await cookies();
        
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set({ name, value, ...options });
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.set({ name, value: '', ...options });
                    },
                },
            }
        );

        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return { valid: false, error: 'Not authenticated' };
        }

        if (user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
            return { valid: false, error: 'Not authorized' };
        }

        return { valid: true };
    } catch (e) {
        console.error('Admin auth error:', e);
        return { valid: false, error: 'Auth check failed' };
    }
}
