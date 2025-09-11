import 'react-native-gesture-handler/jestSetup';

// Mock Reanimated
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Mock React Native Firebase modules used in app
jest.mock('@react-native-firebase/app', () => () => ({}));

jest.mock('@react-native-firebase/auth', () => {
  return () => ({
    currentUser: null,
    onAuthStateChanged: (cb) => {
      cb(null);
      return () => {};
    },
    createUserWithEmailAndPassword: jest.fn(async () => ({
      user: { uid: 'u1', email: 'test@example.com', updateProfile: jest.fn() },
    })),
    signInWithEmailAndPassword: jest.fn(async () => ({
      user: { uid: 'u1', email: 'test@example.com' },
    })),
    signOut: jest.fn(async () => {}),
  });
});

jest.mock('@react-native-firebase/firestore', () => {
  const FieldValue = { serverTimestamp: () => new Date() };
  const emptySnap = { docs: [], exists: false, data: () => ({}) };
  return () => ({
    FieldValue,
    collection: () => ({
      doc: () => ({
        set: jest.fn(async () => {}),
        update: jest.fn(async () => {}),
        delete: jest.fn(async () => {}),
        get: jest.fn(async () => emptySnap),
        onSnapshot: (cb) => {
          cb({ docs: [] });
          return () => {};
        },
      }),
      orderBy: () => ({
        where: () => ({
          startAfter: () => ({ limit: () => ({ get: jest.fn(async () => emptySnap) }) }),
        }),
        limit: () => ({ get: jest.fn(async () => emptySnap) }),
      }),
      where: () => ({ limit: () => ({ get: jest.fn(async () => emptySnap) }) }),
      limit: () => ({ get: jest.fn(async () => emptySnap) }),
    }),
  });
});

jest.mock('@react-native-firebase/storage', () => {
  return () => ({
    ref: () => ({
      putFile: jest.fn(async () => {}),
      getDownloadURL: jest.fn(async () => 'https://example.com/image.jpg'),
    }),
  });
});

