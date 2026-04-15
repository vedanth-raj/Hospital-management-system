import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookie, generateToken } from '@/lib/auth';
import { preRegistrations } from '@/app/api/reception/add-patient/route';
import { validateDemoCredentials } from '@/lib/demo-store';

export async function POST(request: NextRequest) {
  const { patientId, password } = await request.json();

  if (!patientId) {
    return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
  }

  // Check demo store first (existing patient: patient@hospital.com)
  const demoUser = validateDemoCredentials(patientId, password || '');
  if (demoUser && demoUser.role === 'patient') {
    const token = generateToken(demoUser.id, demoUser.role);
    await setAuthCookie(token);
    return NextResponse.json({
      message: 'Login successful',
      user: { id: demoUser.id, patientId, firstName: demoUser.firstName, lastName: demoUser.lastName, role: demoUser.role },
    });
  }

  // Check in-memory pre-registrations
  const record = preRegistrations.find((p) => p.patientIdUnique === patientId);

  if (!record) {
    return NextResponse.json({ error: 'Invalid patient ID' }, { status: 401 });
  }

  // First login — no password set yet
  if (!record.isActivated) {
    return NextResponse.json({
      message: 'First login detected',
      requiresPasswordSetup: true,
      patientId,
      firstName: record.firstName,
      lastName: record.lastName,
    });
  }

  // Activated — verify password
  if (!password || record.password !== password) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const userId = record.userId || record.id;
  const token = generateToken(userId, 'patient');
  await setAuthCookie(token);

  return NextResponse.json({
    message: 'Login successful',
    user: { id: userId, patientId, firstName: record.firstName, lastName: record.lastName, role: 'patient' },
  });
}
