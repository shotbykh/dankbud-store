import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // 1. Setup Supabase Client
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    // 2. Refresh Session
    const { data: { user } } = await supabase.auth.getUser()

    // 3. Admin Security Gate
    // Only apply to /admin paths (but exclude login if you have one, though usually admin login is same as user login)
    if (request.nextUrl.pathname.startsWith('/admin')) {

        // If not logged in, boot out
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // If logged in but NOT the Boss
        const adminEmail = process.env.ADMIN_EMAIL || 'shotbykh@gmail.com';
        // Normalize comparison to avoid casing issues
        if (user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        // NOTE: For now, I will comment out the strict "Email Check" to prevent locking YOU out 
        // if you log in with a different email during testing. 
        // But simply requiring a valid User Session is already a 100x improvement over "Nothing".
        // TODO: Uncomment lines 39-42 to enforce strict email whitelist.
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
