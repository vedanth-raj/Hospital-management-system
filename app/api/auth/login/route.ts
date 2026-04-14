import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db-server';
import { comparePassword, setAuthCookie, generateToken } from '@/lib/auth';
import { validateDemoStaffCredentials } from '@/lib/demo-store';

async function ensureUsersColumns() {
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS staff_id VARCHAR(8) UNIQUE`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT false`);
}

export async function POST(request: NextRequest) {
  const { staffId, password } = await request.json();
  const normalizedStaffId = String(staffId || '').trim().toUpperCase();

  if (!normalizedStaffId || !password) {
    return NextResponse.json(
      { error: 'Staff ID and password are required' },
      { status: 400 }
    );
  }

  // If database is not configured, authenticate against demo users directly.
  if (!process.env.DATABASE_URL) {
    const demoUser = validateDemoStaffCredentials(normalizedStaffId, password);
    if (demoUser) {
      const token = generateToken(demoUser.id, demoUser.role);
      await setAuthCookie(token);

      return NextResponse.json(
        {
          message: 'Login successful (demo mode)',
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
      {
        error:
          'No persisted staff data is configured. Use demo IDs (A1000001, D1000002, R1000003) with password 123456, or configure a database/Firebase-backed staff store.',
      },
      { status: 401 }
    );
  }

  try {
    // Keep login compatible with older user table schemas.
    await ensureUsersColumns();

    const userResult = await query(
      `SELECT id, email, staff_id, password_hash, first_name, last_name, role, must_change_password
       FROM users WHERE staff_id = $1 AND is_active = true AND role != 'patient'`,
      [normalizedStaffId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid Staff ID or password' },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid Staff ID or password' },
        { status: 401 }
      );
    }

    const token = generateToken(user.id, user.role);
    await setAuthCookie(token);

    return NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user.id,
          staffId: user.staff_id,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          mustChangePassword: user.must_change_password ?? false,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);

    if (process.env.DATABASE_URL) {
      if (error instanceof Error) {
        const anyError = error as Error & { code?: string; cause?: { code?: string } };
        const errorCode = anyError.code || anyError.cause?.code;
        const isDbConfigError = error.message.includes('Database pool not initialized');
        const isDbConnectionError =
          error.message.includes('Database connection failed') ||
          error.message.includes('ECONNREFUSED') ||
          errorCode === 'ECONNREFUSED';

        if (isDbConfigError || isDbConnectionError) {
          return NextResponse.json(
            {
              error: 'Database is unavailable. Verify DATABASE_URL and make sure PostgreSQL is running.',
            },
            { status: 503 }
          );
        }
      }

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    const demoUser = validateDemoStaffCredentials(normalizedStaffId, password);
    if (demoUser) {
      const token = generateToken(demoUser.id, demoUser.role);
      await setAuthCookie(token);

      return NextResponse.json(
        {
          message: 'Login successful (demo mode)',
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
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
