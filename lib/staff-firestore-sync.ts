import 'server-only';

import { FieldValue } from 'firebase-admin/firestore';
import { getFirestoreAdmin } from '@/lib/firebase-admin';

type StaffSyncPayload = {
  userId: number;
  staffId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  mustChangePassword: boolean;
  previousEmail?: string | null;
};

export async function syncStaffUserToFirestore(payload: StaffSyncPayload) {
  const db = getFirestoreAdmin();
  if (!db) return;

  const normalizedEmail = String(payload.email || '').trim().toLowerCase();
  if (!normalizedEmail) return;

  const previousEmail = String(payload.previousEmail || '').trim().toLowerCase();

  const userDocRef = db.collection('users').doc(normalizedEmail);
  const existing = await userDocRef.get();

  const docData: Record<string, unknown> = {
    userId: payload.userId,
    staffId: payload.staffId,
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: normalizedEmail,
    phone: payload.phone,
    role: payload.role,
    isActive: payload.isActive,
    mustChangePassword: payload.mustChangePassword,
    patientId: null,
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (!existing.exists) {
    docData.createdAt = FieldValue.serverTimestamp();
  }

  await userDocRef.set(docData, { merge: true });

  if (previousEmail && previousEmail !== normalizedEmail) {
    await db.collection('users').doc(previousEmail).delete().catch(() => {
      // Ignore delete failures for non-existent or already-removed legacy docs.
    });
  }
}
