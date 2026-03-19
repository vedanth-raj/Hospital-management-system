import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'patient') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get patient details
    const patientResult = await query(
      `SELECT p.*, u.email, u.phone, u.first_name, u.last_name
       FROM patients p
       JOIN users u ON p.user_id = u.id
       WHERE p.user_id = $1`,
      [user.userId]
    );

    if (patientResult.rows.length === 0) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    const patient = patientResult.rows[0];

    return NextResponse.json({
      patientId: patient.patient_id_unique,
      firstName: patient.first_name,
      lastName: patient.last_name,
      email: patient.email,
      phone: patient.phone,
      dateOfBirth: patient.date_of_birth,
      gender: patient.gender,
      bloodType: patient.blood_type,
      allergies: patient.allergies,
      medicalHistory: patient.medical_history,
      emergencyContactName: patient.emergency_contact_name,
      emergencyContactPhone: patient.emergency_contact_phone,
      address: patient.address,
      city: patient.city,
      state: patient.state,
      zipCode: patient.zip_code,
    });
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'patient') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Update patient information
    await query(
      `UPDATE patients
       SET date_of_birth = $1, gender = $2, blood_type = $3, allergies = $4,
           medical_history = $5, emergency_contact_name = $6, emergency_contact_phone = $7,
           address = $8, city = $9, state = $10, zip_code = $11, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $12`,
      [
        data.dateOfBirth,
        data.gender,
        data.bloodType,
        data.allergies,
        data.medicalHistory,
        data.emergencyContactName,
        data.emergencyContactPhone,
        data.address,
        data.city,
        data.state,
        data.zipCode,
        user.userId,
      ]
    );

    // Update user phone if provided
    if (data.phone) {
      await query('UPDATE users SET phone = $1 WHERE id = $2', [data.phone, user.userId]);
    }

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating patient profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
