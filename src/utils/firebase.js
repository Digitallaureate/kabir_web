import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// Analytics commented out to avoid 403 errors in development
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD3k3FLgH9nFHG8xFuRJDnesjVmkRkzPQU",
  authDomain: "ecostory-site.firebaseapp.com",
  projectId: "ecostory-site",
  storageBucket: "ecostory-site.firebasestorage.app",
  messagingSenderId: "36036911566",
  appId: "1:36036911566:web:a1983a531840cb85d6cb9f",
  measurementId: "G-FYJPT08842"
};

// Google Maps configuration
const mapsConfig = {
  apiKey: "AIzaSyAIizAnUa0MsDu5wIZ-DYRiM6SGPhDF3KE"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
// Analytics disabled for development to avoid 403 errors
const analytics = null; // typeof window !== 'undefined' ? getAnalytics(app) : null;

// Helper functions for Monuments
export const getMonuments = async () => {
  try {
    const monumentsSnapshot = await getDocs(collection(db, 'monuments'));
    return monumentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching monuments:', error);
    return [];
  }
};

export const addMonument = async (data) => {
  try {
    await addDoc(collection(db, 'monuments'), data);
  } catch (error) {
    console.error('Error adding monument:', error);
    throw error;
  }
};

export const updateMonument = async (id, data) => {
  try {
    const monumentRef = doc(db, 'monuments', id);
    await updateDoc(monumentRef, data);
  } catch (error) {
    console.error('Error updating monument:', error);
    throw error;
  }
};

export const deleteMonument = async (id) => {
  try {
    const monumentRef = doc(db, 'monuments', id);
    await deleteDoc(monumentRef);
  } catch (error) {
    console.error('Error deleting monument:', error);
    throw error;
  }
};

// Helper functions for Submonuments
export const getSubmonuments = async () => {
  try {
    const submonumentsSnapshot = await getDocs(collection(db, 'submonuments'));
    return submonumentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching submonuments:', error);
    return [];
  }
};

export const addSubmonument = async (data) => {
  try {
    await addDoc(collection(db, 'submonuments'), data);
  } catch (error) {
    console.error('Error adding submonument:', error);
    throw error;
  }
};

export const updateSubmonument = async (id, data) => {
  try {
    const submonumentRef = doc(db, 'submonuments', id);
    await updateDoc(submonumentRef, data);
  } catch (error) {
    console.error('Error updating submonument:', error);
    throw error;
  }
};

export const deleteSubmonument = async (id) => {
  try {
    const submonumentRef = doc(db, 'submonuments', id);
    await deleteDoc(submonumentRef);
  } catch (error) {
    console.error('Error deleting submonument:', error);
    throw error;
  }
};

// Helper function for Cities (used in MonumentManager.astro)
export const getCities = async () => {
  try {
    const citiesSnapshot = await getDocs(collection(db, 'cities'));
    return citiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};

export { app, db, auth, storage, analytics, mapsConfig, getAuth };