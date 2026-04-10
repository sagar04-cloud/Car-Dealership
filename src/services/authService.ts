import { auth, realtimeDb } from '../config/firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { ref, get, set } from 'firebase/database';

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

const USERS_COLLECTION = 'users';

export const AuthService = {
  async register(email: string, password: string, name: string, role: 'user' | 'admin' = 'user'): Promise<IUser> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    const userData: any = {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      name,
      role,
      createdAt: new Date().toISOString()
    };
    
    await set(ref(realtimeDb, `${USERS_COLLECTION}/${firebaseUser.uid}`), userData);
    
    return { ...userData, createdAt: new Date(userData.createdAt) };
  },

  async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    const token = await firebaseUser.getIdToken();
    
    const userRef = ref(realtimeDb, `${USERS_COLLECTION}/${firebaseUser.uid}`);
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      throw new Error('User data not found');
    }
    
    const data = snapshot.val();
    const userData: IUser = {
      ...data,
      createdAt: new Date(data.createdAt)
    };
    return { user: userData, token };
  },

  async logout(): Promise<void> {
    await signOut(auth);
  },

  async getCurrentUser(firebaseUser: FirebaseUser): Promise<IUser | null> {
    const userRef = ref(realtimeDb, `${USERS_COLLECTION}/${firebaseUser.uid}`);
    const snapshot = await get(userRef);
    if (!snapshot.exists()) return null;
    const data = snapshot.val();
    return {
      ...data,
      createdAt: new Date(data.createdAt)
    } as IUser;
  },

  onAuthChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
};

export default AuthService;
