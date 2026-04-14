import 'server-only';

import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let appInitialized = false;

function initializeFirebaseAdmin() {
  if (appInitialized) return;
  if (getApps().length > 0) {
    appInitialized = true;
    return;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    return;
  }

  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  appInitialized = true;
}

export async function verifyFirebaseAuthToken(token: string) {
  try {
    initializeFirebaseAdmin();
    if (!getApps().length) {
      return null;
    }

    return await getAuth().verifyIdToken(token);
  } catch {
    return null;
  }
}

export function getFirestoreAdmin() {
  try {
    initializeFirebaseAdmin();
    if (!getApps().length) {
      return null;
    }

    return getFirestore();
  } catch {
    return null;
  }
}
