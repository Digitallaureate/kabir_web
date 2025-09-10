import { db } from '../../utils/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

export const getMonuments = async () => {
  try {
    const monumentsSnapshot = await getDocs(collection(db, 'monuments'));
    return monumentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching monuments:', error);
    return [];
  }
};

export const addMonument = async (data) => {
  try {
    const docRef = await addDoc(collection(db, 'monuments'), data);
    return docRef.id;
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

export const subscribeToMonuments = (callback) => {
  return onSnapshot(collection(db, 'monuments'), (snapshot) => {
    const monuments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(monuments);
  }, (error) => {
    console.error('Error subscribing to monuments:', error);
  });
};