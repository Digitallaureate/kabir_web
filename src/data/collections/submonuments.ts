import { db } from '../../utils/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

export const getSubmonuments = async () => {
  try {
    const submonumentsSnapshot = await getDocs(collection(db, 'submonuments'));
    return submonumentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching submonuments:', error);
    return [];
  }
};

export const addSubmonument = async (data) => {
  try {
    const docRef = await addDoc(collection(db, 'submonuments'), data);
    return docRef.id;
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

export const subscribeToSubmonuments = (callback) => {
  return onSnapshot(collection(db, 'submonuments'), (snapshot) => {
    const submonuments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(submonuments);
  }, (error) => {
    console.error('Error subscribing to submonuments:', error);
  });
};