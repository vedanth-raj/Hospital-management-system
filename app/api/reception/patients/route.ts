import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { preRegistrations } from '../add-patient/route';

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'reception' && user.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const search = request.nextUrl.searchParams.get('q')?.trim().toLowerCase() || '';

  const patients = preRegistrations
    .filter((p) => {
      if (!search) return true;
      const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
      return (
        fullName.includes(search) ||
        p.phone.includes(search) ||
        p.patientIdUnique.toLowerCase().includes(search)
      );
    })
    .map((p) => ({
      id: p.id,
      patientId: p.patientIdUnique,
      firstName: p.firstName,
      lastName: p.lastName,
      age: p.age,
      gender: p.gender,
      phone: p.phone,
      email: p.email,
      address: p.address,
      visitCount: 0,
      scansDone: 0,
      lastVisitDate: null,
    }));

  return NextResponse.json({ patients });
}

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'reception' && user.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();
  if (!data.patientId) {
    return NextResponse.json({ error: 'patientId is required' }, { status: 400 });
  }

  const record = preRegistrations.find((p) => p.patientIdUnique === data.patientId);
  if (!record) {
    return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
  }

  if (data.phone) record.phone = data.phone;
  if (data.age) record.age = data.age;
  if (data.gender) record.gender = data.gender;
  if (data.address) record.address = data.address;

  return NextResponse.json({ message: 'Patient details updated successfully' });
}
