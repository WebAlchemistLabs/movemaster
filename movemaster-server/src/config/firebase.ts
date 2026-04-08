import { env } from './env';

// Firebase Admin is optional — in demo mode we use in-memory storage
let adminApp: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

// Lazy types to avoid import errors when firebase-admin isn't configured
type FirebaseApp = import('firebase-admin/app').App;
type Firestore = import('firebase-admin/firestore').Firestore;
type Auth = import('firebase-admin/auth').Auth;

export async function initFirebase(): Promise<void> {
  if (env.isDemoMode) {
    console.log('  Firebase Admin: DEMO MODE (in-memory store)');
    return;
  }

  try {
    const { initializeApp, cert, getApps } = await import('firebase-admin/app');
    const { getFirestore } = await import('firebase-admin/firestore');
    const { getAuth } = await import('firebase-admin/auth');

    if (getApps().length > 0) {
      adminApp = getApps()[0];
    } else {
      let credential;
      if (env.firebase.serviceAccountPath) {
        const fs = await import('fs');
        const serviceAccount = JSON.parse(
          fs.readFileSync(env.firebase.serviceAccountPath, 'utf8')
        );
        credential = cert(serviceAccount);
      } else if (env.firebase.projectId && env.firebase.clientEmail && env.firebase.privateKey) {
        credential = cert({
          projectId: env.firebase.projectId,
          clientEmail: env.firebase.clientEmail,
          privateKey: env.firebase.privateKey,
        });
      } else {
        throw new Error('No Firebase credentials provided');
      }

      adminApp = initializeApp({ credential });
    }

    db = getFirestore(adminApp);
    auth = getAuth(adminApp);
    console.log('  Firebase Admin: Connected to project', env.firebase.projectId);
  } catch (err) {
    console.error('  Firebase Admin: Failed to initialize —', (err as Error).message);
    console.log('  Falling back to demo mode');
  }
}

export function getDb(): Firestore {
  if (!db) throw new Error('Firestore not initialized');
  return db;
}

export function getAdminAuth(): Auth {
  if (!auth) throw new Error('Firebase Auth not initialized');
  return auth;
}

export function isFirebaseReady(): boolean {
  return db !== null && auth !== null;
}
