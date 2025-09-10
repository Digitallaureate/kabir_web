// src/utils/firebase-admin.js
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let app;

if (!getApps().length) {
  app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);

/**
 * Export all Firebase users with optional pagination.
 */
export const exportAllUsers = async (nextPageToken = undefined) => {
  const result = [];
  let pageToken = nextPageToken;

  do {
    const listUsersResult = await auth.listUsers(1000, pageToken);
    listUsersResult.users.forEach((userRecord) => {
      result.push({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        emailVerified: userRecord.emailVerified,
        disabled: userRecord.disabled,
        metadata: userRecord.metadata,
        customClaims: userRecord.customClaims,
        providerData: userRecord.providerData,
      });
    });

    pageToken = listUsersResult.pageToken;
  } while (pageToken);

  return result;
};

export { auth, db };
