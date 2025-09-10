import type { APIRoute } from 'astro';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const auth = getAuth();
const db = getFirestore();

// GET - Fetch all users
export const GET: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await auth.verifyIdToken(token);

    if (!decodedToken.admin) {
      return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), { status: 403 });
    }

    const { users } = await auth.listUsers();

    const userData = await Promise.all(users.map(async (user) => {
      const userDoc = await db.collection('users').doc(user.uid).get();
      const firestoreData = userDoc.exists ? userDoc.data() : {};

      return {
        uid: user.uid,
        email: user.email || null,
        displayName: user.displayName || null,
        emailVerified: user.emailVerified,
        role: firestoreData?.role || 'user',
        createdAt: firestoreData?.createdAt || null,
        lastLogin: user.metadata?.lastSignInTime || null,
      };
    }));

    return new Response(JSON.stringify(userData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), { status: 500 });
  }
};

// POST - Create a new user
export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await auth.verifyIdToken(token);

    if (!decodedToken.admin) {
      return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), { status: 403 });
    }

    const { email, password, displayName, role = 'user' } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), { status: 400 });
    }

    const userRecord = await auth.createUser({ email, password, displayName });

    await db.collection('users').doc(userRecord.uid).set({
      email,
      displayName: displayName || null,
      createdAt: new Date().toISOString(),
      role: role || 'user'
    });

    return new Response(JSON.stringify(userRecord), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), { status: 500 });
  }
};

// PUT - Update a user
export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await auth.verifyIdToken(token);

    if (!decodedToken.admin) {
      return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), { status: 403 });
    }

    const { uid } = params;
    const { email, displayName, role } = await request.json();

    if (!uid) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }

    await auth.updateUser(uid, { email, displayName });

    await db.collection('users').doc(uid).update({
      email,
      displayName: displayName || null,
      role: role || 'user',
      updatedAt: new Date().toISOString()
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), { status: 500 });
  }
};

// DELETE - Remove a user
export const DELETE: APIRoute = async ({ params, request }) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await auth.verifyIdToken(token);

    if (!decodedToken.admin) {
      return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), { status: 403 });
    }

    const { uid } = params;

    if (!uid) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }

    await auth.deleteUser(uid);
    await db.collection('users').doc(uid).delete();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), { status: 500 });
  }
};
