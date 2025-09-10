import { db } from '../../utils/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

export const getTours = async () => {
  try {
    const toursSnapshot = await getDocs(collection(db, 'tours'));
    return toursSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
};

export const addTour = async (data) => {
  try {
    const docRef = await addDoc(collection(db, 'tours'), data);
    return docRef.id;
  } catch (error) {
    console.error('Error adding tour:', error);
    throw error;
  }
};

export const updateTour = async (id, data) => {
  try {
    const tourRef = doc(db, 'tours', id);
    await updateDoc(tourRef, data);
  } catch (error) {
    console.error('Error updating tour:', error);
    throw error;
  }
};

export const deleteTour = async (id) => {
  try {
    const tourRef = doc(db, 'tours', id);
    await deleteDoc(tourRef);
  } catch (error) {
    console.error('Error deleting tour:', error);
    throw error;
  }
};

export const subscribeToTours = (callback) => {
  return onSnapshot(collection(db, 'tours'), (snapshot) => {
    const tours = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(tours);
  }, (error) => {
    console.error('Error subscribing to tours:', error);
  });
};