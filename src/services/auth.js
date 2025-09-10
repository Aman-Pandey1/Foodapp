import { auth, firestore } from '../firebase';

const USERS_COLLECTION = 'users';

export async function registerWithEmail({ email, password, displayName, role }) {
  const credential = await auth().createUserWithEmailAndPassword(email, password);
  const user = credential.user;
  if (displayName) {
    await user.updateProfile({ displayName });
  }
  const userDoc = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || displayName || '',
    photoURL: user.photoURL || '',
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
    favorites: [],
    ...(role ? { role } : {}),
  };
  await firestore().collection(USERS_COLLECTION).doc(user.uid).set(userDoc, { merge: true });
  return user;
}

export async function loginWithEmail({ email, password }) {
  const credential = await auth().signInWithEmailAndPassword(email, password);
  return credential.user;
}

export async function logout() {
  await auth().signOut();
}

export function observeAuthState(callback) {
  return auth().onAuthStateChanged(callback);
}

export function getCurrentUser() {
  return auth().currentUser;
}

export async function updateProfile({ displayName, photoURL, role }) {
  const user = auth().currentUser;
  if (!user) throw new Error('No authenticated user');
  await user.updateProfile({ displayName, photoURL });
  await firestore().collection(USERS_COLLECTION).doc(user.uid).set({
    displayName: displayName ?? user.displayName ?? '',
    photoURL: photoURL ?? user.photoURL ?? '',
    updatedAt: firestore.FieldValue.serverTimestamp(),
    ...(role ? { role } : {}),
  }, { merge: true });
  return auth().currentUser;
}

export async function getUserProfile(uid) {
  const doc = await firestore().collection(USERS_COLLECTION).doc(uid).get();
  return { uid, ...(doc.exists ? doc.data() : {}) };
}

