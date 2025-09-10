import { db } from '../../utils/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

export const getCities = async () => {
  try {
    const citiesSnapshot = await getDocs(collection(db, 'cities'));
    return citiesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};

export const addCity = async (data) => {
  try {
    const docRef = await addDoc(collection(db, 'cities'), data);
    return docRef.id;
  } catch (error) {
    console.error('Error adding city:', error);
    throw error;
  }
};

export const updateCity = async (id, data) => {
  try {
    const cityRef = doc(db, 'cities', id);
    await updateDoc(cityRef, data);
  } catch (error) {
    console.error('Error updating city:', error);
    throw error;
  }
};

export const deleteCity = async (id) => {
  try {
    const cityRef = doc(db, 'cities', id);
    await deleteDoc(cityRef);
  } catch (error) {
    console.error('Error deleting city:', error);
    throw error;
  }
};

export const subscribeToCities = (callback) => {
  return onSnapshot(collection(db, 'cities'), (snapshot) => {
    const cities = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(cities);
  }, (error) => {
    console.error('Error subscribing to cities:', error);
  });
};