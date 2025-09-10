import { atom } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';
import type { AuthState, User } from '../firebase/types';

export const authState = atom<AuthState>({
  user: null,
  loading: true,
  error: null
});

export const persistentUser = persistentAtom<User | null>('auth:user', null, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const setUser = (user: User | null) => {
  authState.set({
    ...authState.get(),
    user,
    loading: false
  });
  persistentUser.set(user);
};

export const setLoading = (loading: boolean) => {
  authState.set({
    ...authState.get(),
    loading
  });
};

export const setError = (error: string | null) => {
  authState.set({
    ...authState.get(),
    error
  });
};

export const clearAuth = () => {
  authState.set({
    user: null,
    loading: false,
    error: null
  });
  persistentUser.set(null);
};