import { db } from '../../utils/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

export const getExtendedTours = async () => {
  try {
    const extendedToursSnapshot = await getDocs(collection(db, 'extendedTours'));
    return extendedToursSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching extended tours:', error);
    return [];
  }
};

export const addExtendedTour = async (data) => {
  try {
    const docRef = await addDoc(collection(db, 'extendedTours'), data);
    return docRef.id;
  } catch (error) {
    console.error('Error adding extended tour:', error);
    throw error;
  }
};

export const updateExtendedTour = async (id, data) => {
  try {
    const extendedTourRef = doc(db, 'extendedTours', id);
    await updateDoc(extendedTourRef, data);
  } catch (error) {
    console.error('Error updating extended tour:', error);
    throw error;
  }
};

export const deleteExtendedTour = async (id) => {
  try {
    const extendedTourRef = doc(db, 'extendedTours', id);
    await deleteDoc(extendedTourRef);
  } catch (error) {
    console.error('Error deleting extended tour:', error);
    throw error;
  }
};

export const subscribeToExtendedTours = (callback) => {
  return onSnapshot(collection(db, 'extendedTours'), (snapshot) => {
    const extendedTours = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(extendedTours);
  }, (error) => {
    console.error('Error subscribing to extended tours:', error);
  });
};