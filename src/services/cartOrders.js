import { firestore, auth } from '../firebase';

const CART_COLLECTION = 'carts';
const ORDERS_COLLECTION = 'orders';

function getUidOrThrow() {
  const user = auth().currentUser;
  if (!user) throw new Error('Not authenticated');
  return user.uid;
}

// Cart schema: carts/{uid}/items/{foodId} => { qty, foodRef, snapshot }

export async function addToCart({ foodId, qty = 1, title, price, imageURL }) {
  const uid = getUidOrThrow();
  const itemRef = firestore().collection(CART_COLLECTION).doc(uid).collection('items').doc(foodId);
  const doc = await itemRef.get();
  const existing = doc.exists ? doc.data() : null;
  const newQty = (existing?.qty || 0) + qty;
  await itemRef.set({
    foodId,
    qty: newQty,
    title: title ?? existing?.title ?? '',
    price: Number(price ?? existing?.price ?? 0),
    imageURL: imageURL ?? existing?.imageURL ?? '',
    updatedAt: firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
}

export async function setCartItemQty({ foodId, qty }) {
  const uid = getUidOrThrow();
  const itemRef = firestore().collection(CART_COLLECTION).doc(uid).collection('items').doc(foodId);
  if (qty <= 0) {
    await itemRef.delete();
    return;
  }
  await itemRef.set({ qty, updatedAt: firestore.FieldValue.serverTimestamp() }, { merge: true });
}

export async function removeFromCart(foodId) {
  const uid = getUidOrThrow();
  await firestore().collection(CART_COLLECTION).doc(uid).collection('items').doc(foodId).delete();
}

export async function clearCart() {
  const uid = getUidOrThrow();
  const itemsSnap = await firestore().collection(CART_COLLECTION).doc(uid).collection('items').get();
  const batch = firestore().batch();
  itemsSnap.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
}

export async function getCart() {
  const uid = getUidOrThrow();
  const snap = await firestore().collection(CART_COLLECTION).doc(uid).collection('items').get();
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  const totals = items.reduce((acc, it) => {
    acc.qty += it.qty || 0;
    acc.subtotal += (Number(it.price) || 0) * (it.qty || 0);
    return acc;
  }, { qty: 0, subtotal: 0 });
  return { items, ...totals };
}

export function observeCart(callback) {
  const uid = getUidOrThrow();
  return firestore().collection(CART_COLLECTION).doc(uid).collection('items').onSnapshot(snap => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const totals = items.reduce((acc, it) => {
      acc.qty += it.qty || 0;
      acc.subtotal += (Number(it.price) || 0) * (it.qty || 0);
      return acc;
    }, { qty: 0, subtotal: 0 });
    callback({ items, ...totals });
  });
}

export async function checkout({ address, note }) {
  const uid = getUidOrThrow();
  const cartSnap = await firestore().collection(CART_COLLECTION).doc(uid).collection('items').get();
  if (cartSnap.empty) throw new Error('Cart is empty');
  const items = cartSnap.docs.map(d => ({ foodId: d.id, ...d.data() }));
  const subtotal = items.reduce((sum, it) => sum + (Number(it.price) || 0) * (it.qty || 0), 0);
  const orderRef = firestore().collection(ORDERS_COLLECTION).doc();
  const order = {
    id: orderRef.id,
    userId: uid,
    items,
    subtotal,
    status: 'placed',
    address: address || '',
    note: note || '',
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  };
  const batch = firestore().batch();
  batch.set(orderRef, order);
  cartSnap.docs.forEach(d => batch.delete(d.ref));
  await batch.commit();
  return order;
}

export async function listOrders({ limit = 20, startAfter } = {}) {
  const uid = getUidOrThrow();
  let query = firestore().collection(ORDERS_COLLECTION).where('userId', '==', uid).orderBy('createdAt', 'desc');
  if (startAfter) query = query.startAfter(startAfter);
  const snap = await query.limit(limit).get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function observeOrders(callback) {
  const uid = getUidOrThrow();
  return firestore().collection(ORDERS_COLLECTION).where('userId', '==', uid).orderBy('createdAt', 'desc').onSnapshot(snap => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

