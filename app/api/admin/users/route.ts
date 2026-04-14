import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, hashPassword } from '@/lib/auth';
import { query } from '@/lib/db-server';
import { createStaffUser, getStaffUsers, toggleStaffActive, updateStaffUser } from '@/lib/demo-store';
import { syncStaffUserToFirestore } from '@/lib/staff-firestore-sync';

const ROLE_PREFIX: Record<string, string> = {
  admin: 'A', doctor: 'D', reception: 'R', driver: 'E', patient: 'P',
};

function generateStaffId(role: string): string {
  const prefix = ROLE_PREFIX[role] || 'S';
  return `${prefix}${String(Math.floor(1000000 + Math.random() * 9000000))}`;
}

async function ensureColumns() {
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS staff_id VARCHAR(9) UNIQUE`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20)`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT false`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
}

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await ensureColumns();
    const result = await query(
      `SELECT id, staff_id, first_name, last_name, email, phone, role, is_active, must_change_password, created_at
       FROM users WHERE role != 'patient' ORDER BY created_at DESC`
    );
    return NextResponse.json({
      users: result.rows.map((r) => ({
        id: r.id,
        staffId: r.staff_id,
        firstName: r.first_name,
        lastName: r.last_name,
        email: r.email,
        phone: r.phone,
        role: r.role,
        isActive: r.is_active,
        mustChangePassword: r.must_change_password,
        createdAt: r.created_at,
      })),
    });
  } catch (error) {
    console.error('Error fetching staff:', error);
    if (process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Failed to fetch staff users' }, { status: 500 });
    }
    return NextResponse.json({ users: getStaffUsers() }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { firstName, lastName, email, phone, role, specialization } = await request.json();
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedPhone = String(phone || '').trim();

  if (!firstName || !lastName || !role) {
    return NextResponse.json({ error: 'firstName, lastName, and role are required' }, { status: 400 });
  }
  if (!normalizedEmail) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }
  if (!normalizedPhone) {
    return NextResponse.json({ error: 'Mobile number is required' }, { status: 400 });
  }
  if (!['admin', 'doctor', 'reception', 'driver'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  try {
    await ensureColumns();

    const existingUserEmail = await query('SELECT id FROM users WHERE LOWER(email) = $1 LIMIT 1', [normalizedEmail]);
    if (existingUserEmail.rows.length > 0) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    const existingUserPhone = await query('SELECT id FROM users WHERE phone = $1 LIMIT 1', [normalizedPhone]);
    if (existingUserPhone.rows.length > 0) {
      return NextResponse.json({ error: 'Mobile number already exists' }, { status: 409 });
    }

    try {
      const existingPatientEmail = await query('SELECT id FROM patient_pre_registration WHERE LOWER(email) = $1 LIMIT 1', [normalizedEmail]);
      if (existingPatientEmail.rows.length > 0) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
      }
      const existingPatientPhone = await query('SELECT id FROM patient_pre_registration WHERE phone = $1 LIMIT 1', [normalizedPhone]);
      if (existingPatientPhone.rows.length > 0) {
        return NextResponse.json({ error: 'Mobile number already exists' }, { status: 409 });
      }
    } catch {
      // patient_pre_registration table may not exist in some environments
    }

    let staffId = '';
    for (let i = 0; i < 10; i++) {
      const candidate = generateStaffId(role);
      const existing = await query('SELECT id FROM users WHERE staff_id = $1', [candidate]);
      if (existing.rows.length > 0) {
        continue;
      }

      let clashesWithPatientId = false;
      try {
        const patientIdMatch = await query(
          'SELECT id FROM patient_pre_registration WHERE patient_id_unique = $1',
          [candidate]
        );
        clashesWithPatientId = patientIdMatch.rows.length > 0;
      } catch {
        // patient_pre_registration table may not exist in some environments
      }

      if (!clashesWithPatientId) {
        staffId = candidate;
        break;
      }
    }
    if (!staffId) return NextResponse.json({ error: 'Could not generate unique Staff ID' }, { status: 500 });

    const passwordHash = await hashPassword('123456');

    const result = await query(
      `INSERT INTO users (staff_id, email, phone, password_hash, first_name, last_name, role, is_active, must_change_password)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true, true)
       RETURNING id, staff_id, first_name, last_name, role`,
      [staffId, normalizedEmail, normalizedPhone, passwordHash, firstName, lastName, role]
    );

    const created = result.rows[0];

    if (role === 'doctor') {
      await query(
        `INSERT INTO doctors (user_id, specialization, license_number, is_available) VALUES ($1, $2, $3, true)`,
        [created.id, specialization || 'General Medicine', `LIC${Date.now()}`]
      );
    }

    await syncStaffUserToFirestore({
      userId: Number(created.id),
      staffId: String(created.staff_id),
      firstName: String(created.first_name),
      lastName: String(created.last_name),
      email: normalizedEmail,
      phone: normalizedPhone || null,
      role: String(created.role),
      isActive: true,
      mustChangePassword: true,
    }).catch((syncError) => {
      console.error('Firestore staff sync warning:', syncError);
    });

    return NextResponse.json({
      message: 'Staff account created',
      user: { id: created.id, staffId: created.staff_id, firstName: created.first_name, lastName: created.last_name, role: created.role },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating staff:', error);
    if (process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Failed to create staff account' }, { status: 500 });
    }
    const demo = createStaffUser({ firstName, lastName, email, phone, role, specialization });
    if (!demo) return NextResponse.json({ error: 'Staff ID conflict or DB error' }, { status: 500 });
    return NextResponse.json({
      message: 'Staff account created (demo mode)',
      user: { id: demo.id, staffId: demo.staffId, firstName: demo.firstName, lastName: demo.lastName, role: demo.role },
    }, { status: 201 });
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  // Toggle active/inactive
  if (typeof body.isActive === 'boolean' && body.userId) {
    try {
      await query(
        `UPDATE users SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND role != 'patient'`,
        [body.isActive, body.userId]
      );

      const rowResult = await query(
        `SELECT id, staff_id, first_name, last_name, email, phone, role, is_active, must_change_password
         FROM users WHERE id = $1 AND role != 'patient' LIMIT 1`,
        [body.userId]
      );

      const updatedUser = rowResult.rows[0];
      if (updatedUser) {
        await syncStaffUserToFirestore({
          userId: Number(updatedUser.id),
          staffId: String(updatedUser.staff_id || ''),
          firstName: String(updatedUser.first_name || ''),
          lastName: String(updatedUser.last_name || ''),
          email: String(updatedUser.email || ''),
          phone: updatedUser.phone ? String(updatedUser.phone) : null,
          role: String(updatedUser.role || ''),
          isActive: Boolean(updatedUser.is_active),
          mustChangePassword: Boolean(updatedUser.must_change_password),
        }).catch((syncError) => {
          console.error('Firestore staff sync warning:', syncError);
        });
      }

      return NextResponse.json({ message: `User ${body.isActive ? 'activated' : 'deactivated'}` });
    } catch {
      toggleStaffActive(body.userId, body.isActive);
      return NextResponse.json({ message: `User ${body.isActive ? 'activated' : 'deactivated'}` });
    }
  }

  // Edit staff details
  if (body.userId) {
    try {
      await ensureColumns();
      const existingResult = await query(
        `SELECT email FROM users WHERE id = $1 AND role != 'patient' LIMIT 1`,
        [body.userId]
      );
      const previousEmail = existingResult.rows[0]?.email ? String(existingResult.rows[0].email) : null;

      await query(
        `UPDATE users
         SET first_name = COALESCE($1, first_name),
             last_name  = COALESCE($2, last_name),
             email      = COALESCE($3, email),
             phone      = COALESCE($4, phone),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $5 AND role != 'patient'`,
        [body.firstName || null, body.lastName || null, body.email || null, body.phone || null, body.userId]
      );

      const updatedResult = await query(
        `SELECT id, staff_id, first_name, last_name, email, phone, role, is_active, must_change_password
         FROM users WHERE id = $1 AND role != 'patient' LIMIT 1`,
        [body.userId]
      );

      const updatedUser = updatedResult.rows[0];
      if (updatedUser) {
        await syncStaffUserToFirestore({
          userId: Number(updatedUser.id),
          staffId: String(updatedUser.staff_id || ''),
          firstName: String(updatedUser.first_name || ''),
          lastName: String(updatedUser.last_name || ''),
          email: String(updatedUser.email || ''),
          phone: updatedUser.phone ? String(updatedUser.phone) : null,
          role: String(updatedUser.role || ''),
          isActive: Boolean(updatedUser.is_active),
          mustChangePassword: Boolean(updatedUser.must_change_password),
          previousEmail,
        }).catch((syncError) => {
          console.error('Firestore staff sync warning:', syncError);
        });
      }

      if (body.specialization) {
        await query(`UPDATE doctors SET specialization = $1 WHERE user_id = $2`, [body.specialization, body.userId]);
      }
      return NextResponse.json({ message: 'Staff updated' });
    } catch (error) {
      if (process.env.DATABASE_URL) {
        console.error('Error updating staff:', error);
        return NextResponse.json({ error: 'Failed to update staff user' }, { status: 500 });
      }
      updateStaffUser(body.userId, body);
      return NextResponse.json({ message: 'Staff updated' });
    }
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}
