import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

// In-memory patient pre-registration store
const preRegistrations: Array<{
  id: number;
  patientIdUnique: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  age: number;
  gender: string;
  address: string;
  isActivated: boolean;
  userId: number | null;
  password: string | null;
}> = [];

let preRegCounter = 1;

function generatePatientId() {
  const year = new Date().getFullYear();
  const prefix = `DC${year}`;
  const seq = String(preRegCounter).padStart(3, '0');
  return `${prefix}${seq}`;
}

export { preRegistrations };

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user || user.role !== 'reception') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { firstName, lastName, phone, email, age, gender, address } = await request.json();

  if (!firstName || !lastName || !phone || !age || !gender || !address) {
    return NextResponse.json(
      { error: 'First name, last name, age, gender, mobile number, and address are required' },
      { status: 400 }
    );
  }

  const parsedAge = Number(age);
  if (!Number.isInteger(parsedAge) || parsedAge <= 0 || parsedAge > 130) {
    return NextResponse.json({ error: 'Age must be a valid number between 1 and 130' }, { status: 400 });
  }

  const normalizedEmail = typeof email === 'string' && email.trim() ? email.trim().toLowerCase() : null;

  const patientId = generatePatientId();
  preRegCounter++;

  const record = {
    id: preRegCounter,
    patientIdUnique: patientId,
    firstName,
    lastName,
    phone,
    email: normalizedEmail,
    age: parsedAge,
    gender,
    address,
    isActivated: false,
    userId: null,
    password: null,
  };

  preRegistrations.push(record);

  return NextResponse.json(
    {
      message: 'Patient pre-registration created successfully',
      patient: {
        patientId: record.patientIdUnique,
        firstName: record.firstName,
        lastName: record.lastName,
        age: record.age,
        gender: record.gender,
        phone: record.phone,
        email: record.email,
        address: record.address,
      },
    },
    { status: 201 }
  );
}
