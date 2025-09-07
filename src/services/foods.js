import { firestore, storage, auth } from '../firebase';

const FOODS_COLLECTION = 'foods';
const USERS_COLLECTION = 'users';

function getUidOrThrow() {
  const user = auth().currentUser;
  if (!user) throw new Error('Not authenticated');
  return user.uid;
}

export async function createFood({ title, description, price, imageUri, category }) {
  const uid = getUidOrThrow();
  const foodRef = firestore().collection(FOODS_COLLECTION).doc();

  let imageURL = '';
  if (imageUri) {
    const path = `foods/${uid}/${foodRef.id}-${Date.now()}.jpg`;
    const ref = storage().ref(path);
    await ref.putFile(imageUri);
    imageURL = await ref.getDownloadURL();
  }

  const food = {
    id: foodRef.id,
    ownerId: uid,
    title,
    description: description || '',
    price: Number(price) || 0,
    category: category || 'general',
    imageURL,
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  };
  await foodRef.set(food);
  return food;
}

export async function updateFood(id, { title, description, price, imageUri, category }) {
  const uid = getUidOrThrow();
  const ref = firestore().collection(FOODS_COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) throw new Error('Food not found');
  const data = doc.data();
  if (data.ownerId !== uid) throw new Error('Not allowed');

  let imageURL = data.imageURL || '';
  if (imageUri) {
    const path = `foods/${uid}/${id}-${Date.now()}.jpg`;
    const sref = storage().ref(path);
    await sref.putFile(imageUri);
    imageURL = await sref.getDownloadURL();
  }

  const payload = {
    ...(title !== undefined ? { title } : {}),
    ...(description !== undefined ? { description } : {}),
    ...(price !== undefined ? { price: Number(price) } : {}),
    ...(category !== undefined ? { category } : {}),
    imageURL,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  };
  await ref.update(payload);
  return { id, ...data, ...payload };
}

export async function deleteFood(id) {
  const uid = getUidOrThrow();
  const ref = firestore().collection(FOODS_COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return;
  const data = doc.data();
  if (data.ownerId !== uid) throw new Error('Not allowed');
  await ref.delete();
}

export async function getFood(id) {
  const doc = await firestore().collection(FOODS_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function listFoods({ ownerId, category, limit = 20, startAfter } = {}) {
  let query = firestore().collection(FOODS_COLLECTION).orderBy('createdAt', 'desc');
  if (ownerId) query = query.where('ownerId', '==', ownerId);
  if (category) query = query.where('category', '==', category);
  if (startAfter) query = query.startAfter(startAfter);
  const snap = await query.limit(limit).get();
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  const last = snap.docs[snap.docs.length - 1];
  return { items, lastDoc: last };
}

export function observeFoods({ ownerId, category, limit = 50 } = {}, callback) {
  let query = firestore().collection(FOODS_COLLECTION).orderBy('createdAt', 'desc').limit(limit);
  if (ownerId) query = query.where('ownerId', '==', ownerId);
  if (category) query = query.where('category', '==', category);
  return query.onSnapshot((snap) => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

export async function toggleFavorite(foodId) {
  const uid = getUidOrThrow();
  const userRef = firestore().collection(USERS_COLLECTION).doc(uid);
  const userDoc = await userRef.get();
  const data = userDoc.exists ? userDoc.data() : {};
  const favorites = Array.isArray(data.favorites) ? data.favorites : [];
  const has = favorites.includes(foodId);
  const updated = has ? favorites.filter(id => id !== foodId) : [...favorites, foodId];
  await userRef.set({ favorites: updated, updatedAt: firestore.FieldValue.serverTimestamp() }, { merge: true });
  return updated;
}

export async function listFavorites(uid) {
  const userDoc = await firestore().collection(USERS_COLLECTION).doc(uid).get();
  const favorites = userDoc.exists && Array.isArray(userDoc.data().favorites) ? userDoc.data().favorites : [];
  if (favorites.length === 0) return [];
  const snaps = await Promise.all(favorites.map(id => firestore().collection(FOODS_COLLECTION).doc(id).get()));
  return snaps.filter(s => s.exists).map(s => ({ id: s.id, ...s.data() }));
}

