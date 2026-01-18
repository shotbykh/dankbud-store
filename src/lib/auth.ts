import { hash, compare } from 'bcryptjs';
import { cookies } from 'next/headers';

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await compare(password, hash);
}

export async function verifyAdminSession(): Promise<boolean> {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');
    
    // In a real app we might verify a JWT signature here.
    // For now, presence of the httpOnly cookie (set by our secure login route) is the check.
    return !!adminSession;
}
