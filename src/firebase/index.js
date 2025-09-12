// Lazily require Firebase native modules to avoid triggering native init at import time.
// This helps prevent immediate native crashes on misconfiguration.
let _authModule;
let _firestoreModule;
let _storageModule;

function getAuthModule() {
  if (_authModule) return _authModule;
  try {
    // eslint-disable-next-line global-require
    _authModule = require('@react-native-firebase/auth').default;
  } catch (_e) {
    _authModule = null;
  }
  return _authModule;
}

function getFirestoreModule() {
  if (_firestoreModule) return _firestoreModule;
  try {
    // eslint-disable-next-line global-require
    _firestoreModule = require('@react-native-firebase/firestore').default;
  } catch (_e) {
    _firestoreModule = null;
  }
  return _firestoreModule;
}

function getStorageModule() {
  if (_storageModule) return _storageModule;
  try {
    // eslint-disable-next-line global-require
    _storageModule = require('@react-native-firebase/storage').default;
  } catch (_e) {
    _storageModule = null;
  }
  return _storageModule;
}

// Public functions mirroring the RN Firebase API style: auth() / firestore() / storage()
const auth = () => {
  const mod = getAuthModule();
  if (mod) return mod();
  // Minimal fallback to avoid hard crash in JS environments without native modules (e.g., tests)
  return {
    currentUser: null,
    onAuthStateChanged: (cb) => { setTimeout(() => cb(null), 0); return () => {}; },
    createUserWithEmailAndPassword: async () => { throw new Error('Firebase Auth unavailable'); },
    signInWithEmailAndPassword: async () => { throw new Error('Firebase Auth unavailable'); },
    signOut: async () => {},
  };
};

const fallbackFieldValue = { serverTimestamp: () => new Date() };

const firestore = () => {
  const mod = getFirestoreModule();
  if (mod) return mod();
  // Lightweight fallback used only in non-native contexts (tests). Do not use in production.
  return {
    FieldValue: fallbackFieldValue,
    batch: () => ({ set: () => {}, delete: () => {}, commit: async () => {} }),
    collection: () => ({
      doc: () => ({
        set: async () => {},
        update: async () => {},
        delete: async () => {},
        get: async () => ({ exists: false, data: () => ({}) }),
      }),
      orderBy: () => ({
        where: () => ({
          startAfter: () => ({
            limit: () => ({ get: async () => ({ docs: [] }) }),
          }),
        }),
        limit: () => ({ get: async () => ({ docs: [] }) }),
        onSnapshot: (cb) => { cb({ docs: [] }); return () => {}; },
      }),
      where: () => ({
        limit: () => ({ get: async () => ({ docs: [] }) }),
        onSnapshot: (cb) => { cb({ docs: [] }); return () => {}; },
      }),
      limit: () => ({ get: async () => ({ docs: [] }) }),
      onSnapshot: (cb) => { cb({ docs: [] }); return () => {}; },
    }),
  };
};

// Mirror RNFirebase API: expose FieldValue on the callable function as a static prop
try {
  Object.defineProperty(firestore, 'FieldValue', {
    configurable: true,
    enumerable: true,
    get() {
      const mod = getFirestoreModule();
      if (mod && mod.FieldValue) return mod.FieldValue;
      return fallbackFieldValue;
    },
  });
} catch (_e) {
  // Assign directly if defineProperty is not available for some reason
  // eslint-disable-next-line no-param-reassign
  firestore.FieldValue = fallbackFieldValue;
}

const storage = () => {
  const mod = getStorageModule();
  if (mod) return mod();
  return {
    ref: () => ({ putFile: async () => {}, getDownloadURL: async () => '' }),
  };
};

// Helpers
const getCurrentUser = () => {
  try {
    return auth().currentUser;
  } catch (_e) {
    return null;
  }
};

const onAuthChanged = (callback) => {
  try {
    return auth().onAuthStateChanged(callback);
  } catch (_e) {
    setTimeout(() => callback(null), 0);
    return () => {};
  }
};

export { auth, firestore, storage, getCurrentUser, onAuthChanged };

