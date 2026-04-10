import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { auth, realtimeDb } from '../config/firebase';

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded admin credentials (used when Firebase Auth is unavailable)
const LOCAL_ADMIN = {
  email: 'admin@ssxmotors.com',
  password: 'admin123',
  user: {
    id: 'local-admin',
    email: 'admin@ssxmotors.com',
    role: 'admin' as const,
    name: 'Admin',
  },
};

const SESSION_KEY = 'ssx_local_user';

// Helper to read/write the local fallback session
const getLocalSession = (): User | null => {
  try {
    const s = localStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
};
const setLocalSession = (u: User) => localStorage.setItem(SESSION_KEY, JSON.stringify(u));
const clearLocalSession = () => localStorage.removeItem(SESSION_KEY);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First: restore local fallback session immediately
    const localUser = getLocalSession();
    if (localUser) {
      setUser(localUser);
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Firebase auth took over — clear local session
        clearLocalSession();
        try {
          const userRef = ref(realtimeDb, `users/${firebaseUser.uid}`);
          const userSnap = await get(userRef);
          if (userSnap.exists()) {
            const data = userSnap.val();
            setUser({
              id: firebaseUser.uid,
              email: data.email || firebaseUser.email || '',
              role: data.role || 'user',
              name: data.name || data.email || '',
            });
          } else {
            // User exists in Firebase Auth but not in Realtime Database
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              role: 'user',
              name: firebaseUser.email?.split('@')[0] || '',
            });
          }
        } catch (error) {
          console.warn('Could not fetch user from Database:', error);
        }
      } else {
        // No Firebase user — only clear if no local fallback session
        if (!getLocalSession()) {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    // Check local admin credentials FIRST (always works regardless of Firebase setup)
    if (email === LOCAL_ADMIN.email && password === LOCAL_ADMIN.password) {
      setUser(LOCAL_ADMIN.user);
      setLocalSession(LOCAL_ADMIN.user);
      return;
    }

    // Try Firebase Auth for regular users
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = credential.user;

      const userRef = ref(realtimeDb, `users/${firebaseUser.uid}`);
      const userSnap = await get(userRef);

      if (!userSnap.exists()) {
        // Create user doc if it doesn't exist
        await set(userRef, {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: email.split('@')[0],
          role: 'user',
          createdAt: new Date().toISOString(),
        });
        setUser({ id: firebaseUser.uid, email: firebaseUser.email!, role: 'user', name: email.split('@')[0] });
      } else {
        const data = userSnap.val();
        setUser({
          id: firebaseUser.uid,
          email: data.email || firebaseUser.email!,
          role: data.role || 'user',
          name: data.name || '',
        });
      }
    } catch (firebaseError: any) {
      const code = firebaseError?.code || '';
      if (code === 'auth/wrong-password' || code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password');
      }
      if (code === 'auth/configuration-not-found' || code === 'auth/operation-not-allowed') {
        throw new Error('Firebase Authentication is not set up. Please enable Email/Password sign-in in Firebase Console.');
      }
      throw new Error(firebaseError.message || 'Login failed');
    }
  };

  const logout = async () => {
    try { await signOut(auth); } catch {}
    clearLocalSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
