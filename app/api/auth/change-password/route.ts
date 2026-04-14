import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db-server';
import { hashPassword, comparePassword } from '@/lib/auth';
import { changeStaffPassword } from '@/lib/demo-store';

const STRONG_PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const numericUserId =
    typeof user.userId === 'number' ? user.userId : Number(user.userId);

  const { currentPassword, newPassword, confirmPassword } = await request.json();

  if (!currentPassword || !newPassword || !confirmPassword) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }
  if (newPassword !== confirmPassword) {
    return NextResponse.json({ error: 'New passwords do not match' }, { status: 400 });
  }
  if (!STRONG_PASSWORD_PATTERN.test(newPassword)) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol' },
      { status: 400 }
    );
  }
  if (newPassword === '123456') {
    return NextResponse.json({ error: 'Please choose a different password than the default' }, { status: 400 });
  }

  try {
    if (Number.isNaN(numericUserId)) {
      return NextResponse.json({ error: 'Invalid user session' }, { status: 401 });
    }

    await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT false`);

    const result = await query('SELECT password_hash FROM users WHERE id = $1', [numericUserId]);
    if (result.rows.length === 0) throw new Error('User not found');

    const valid = await comparePassword(currentPassword, result.rows[0].password_hash);
    if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });

    const newHash = await hashPassword(newPassword);
    await query(
      `UPDATE users SET password_hash = $1, must_change_password = false, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [newHash, numericUserId]
    );

    return NextResponse.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    // Demo fallback
    const changed = Number.isNaN(numericUserId)
      ? false
      : changeStaffPassword(numericUserId, newPassword);
    if (changed) return NextResponse.json({ message: 'Password changed successfully' });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
