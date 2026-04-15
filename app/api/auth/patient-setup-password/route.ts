import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookie, generateToken } from '@/lib/auth';
import { preRegistrations } from '@/app/api/reception/add-patient/route';

const STRONG_PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export async function POST(request: NextRequest) {
  const { patientId, password, confirmPassword } = await request.json();

  if (!patientId || !password || !confirmPassword) {
    return NextResponse.json({ error: 'Patient ID, password, and confirmation are required' }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
  }

  if (!STRONG_PASSWORD_PATTERN.test(password)) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol' },
      { status: 400 }
    );
  }

  const record = preRegistrations.find((p) => p.patientIdUnique === patientId);

  if (!record) {
    return NextResponse.json({ error: 'Invalid patient ID' }, { status: 404 });
  }

  if (record.isActivated) {
    return NextResponse.json({ error: 'This patient account is already activated' }, { status: 400 });
  }

  // Activate account with password
  record.isActivated = true;
  record.password = password;
  record.userId = record.id;

  const token = generateToken(record.id, 'patient');
  await setAuthCookie(token);

  return NextResponse.json(
    {
      message: 'Account setup successful',
      user: { id: record.id, patientId, firstName: record.firstName, lastName: record.lastName, role: 'patient' },
    },
    { status: 201 }
  );
}
