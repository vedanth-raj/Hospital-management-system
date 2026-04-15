import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookie, generateToken } from '@/lib/auth';
import { validateDemoStaffCredentials } from '@/lib/demo-store';

export async function POST(request: NextRequest) {
  const { staffId, password } = await request.json();
  const normalizedStaffId = String(staffId || '').trim();

  if (!normalizedStaffId || !password) {
    return NextResponse.json(
      { error: 'Staff ID and password are required' },
      { status: 400 }
    );
  }

  // Always use demo store (fully offline mode)
  const demoUser = validateDemoStaffCredentials(normalizedStaffId, password);
  if (demoUser) {
    const token = generateToken(demoUser.id, demoUser.role);
    await setAuthCookie(token);
    return NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: demoUser.id,
          staffId: demoUser.staffId,
          firstName: demoUser.firstName,
          lastName: demoUser.lastName,
          role: demoUser.role,
          mustChangePassword: demoUser.mustChangePassword ?? false,
        },
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { error: 'Invalid Staff ID or password' },
    { status: 401 }
  );
}
