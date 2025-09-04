import Constants from 'expo-constants';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const extra = (Constants?.expoConfig as any)?.extra || (Constants as any)?.manifest?.extra || {};
const firebaseExtra = extra?.firebase || {};

const firebaseConfig = {
  apiKey: firebaseExtra.apiKey || process.env.FIREBASE_API_KEY,
  authDomain: firebaseExtra.authDomain || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: firebaseExtra.projectId || process.env.FIREBASE_PROJECT_ID,
  storageBucket: firebaseExtra.storageBucket || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: firebaseExtra.messagingSenderId || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: firebaseExtra.appId || process.env.FIREBASE_APP_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

