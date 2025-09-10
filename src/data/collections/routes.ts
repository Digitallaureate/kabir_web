import { db } from '../../utils/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

export const getRoutes = async () => {
  try {
    const routesSnapshot = await getDocs(collection(db, 'routes'));
    return routesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching routes:', error);
    return [];
  }
};

export const addRoute = async (data) => {
  try {
    const docRef = await addDoc(collection(db, 'routes'), data);
    return docRef.id;
  } catch (error) {
    console.error('Error adding route:', error);
    throw error;
  }
};

export const updateRoute = async (id, data) => {
  try {
    const routeRef = doc(db, 'routes', id);
    await updateDoc(routeRef, data);
  } catch (error) {
    console.error('Error updating route:', error);
    throw error;
  }
};

export const deleteRoute = async (id) => {
  try {
    const routeRef = doc(db, 'routes', id);
    await deleteDoc(routeRef);
  } catch (error) {
    console.error('Error deleting route:', error);
    throw error;
  }
};

export const subscribeToRoutes = (callback) => {
  return onSnapshot(collection(db, 'routes'), (snapshot) => {
    const routes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(routes);
  }, (error) => {
    console.error('Error subscribing to routes:', error);
  });
};