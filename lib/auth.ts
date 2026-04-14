import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { verifyFirebaseAuthToken } from '@/lib/firebase-admin';

const TOKEN_EXPIRY = '7d';

type AuthUser = {
  userId: number | string;
  role: string;
  firebase?: any;
};

function parseDemoToken(token: string): AuthUser | null {
  if (!token.startsWith('demo:')) return null;
  const parts = token.split(':');
  if (parts.length < 3) return null;

  const parsedUserId = Number(parts[1]);
  return {
    userId: Number.isNaN(parsedUserId) ? parts[1] : parsedUserId,
    role: parts[2] || 'patient',
  };
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: number, role: string): string {
  return `demo:${userId}:${role}:${TOKEN_EXPIRY}`;
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  const demoUser = parseDemoToken(token);
  if (demoUser) return demoUser;

  const decoded = await verifyFirebaseAuthToken(token);
  if (!decoded) return null;

  return {
    userId: decoded.uid,
    role: (decoded.role as string) || 'patient',
    firebase: decoded,
  };
}

function roleFromToken(token: string): string {
  const demoUser = parseDemoToken(token);
  if (demoUser?.role) return demoUser.role;

  const parts = token.split('.');
  if (parts.length !== 3) return 'patient';

  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    return payload?.role || 'patient';
  } catch {
    return 'patient';
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  cookieStore.set('auth_role', roleFromToken(token), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  return token || null;
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  cookieStore.delete('auth_role');
}

export async function getCurrentUser() {
  const token = await getAuthToken();
  if (!token) return null;
  const decoded = await verifyToken(token);
  return decoded;
}
