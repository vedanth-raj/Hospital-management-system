import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  
  // Only receptionists can add patients
  if (!user || user.role !== 'reception') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { firstName, lastName, phone } = await request.json();

    // Validate required fields
    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }

    // Generate unique 11-digit patient ID
    let patientId = '';
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      // Generate 11 digits: PXXXXXXXXXXX (P + 10 digits)
      const randomDigits = Math.floor(Math.random() * 10000000000)
        .toString()
        .padStart(10, '0');
      patientId = `P${randomDigits}`;

      // Check if unique
      const existingCheck = await query(
        'SELECT id FROM patient_pre_registration WHERE patient_id_unique = $1',
        [patientId]
      );

      if (existingCheck.rows.length === 0) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return NextResponse.json(
        { error: 'Failed to generate unique patient ID' },
        { status: 500 }
      );
    }

    // Create pre-registration record
    const result = await query(
      `INSERT INTO patient_pre_registration (
        patient_id_unique, first_name, last_name, phone, created_by_receptionist_id, is_activated
      )
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, patient_id_unique, first_name, last_name`,
      [patientId, firstName, lastName, phone || null, user.userId, false]
    );

    const preReg = result.rows[0];

    return NextResponse.json(
      {
        message: 'Patient pre-registration created successfully',
        patient: {
          patientId: preReg.patient_id_unique,
          firstName: preReg.first_name,
          lastName: preReg.last_name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
