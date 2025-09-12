/* eslint-env jest */
import 'react-native-gesture-handler/jestSetup';

// Mock Reanimated
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Mock react-native-screens to prevent requireNativeComponent errors in tests
jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
}));

// Mock native-stack navigator to a lightweight no-op implementation for tests
jest.mock('@react-navigation/native-stack', () => {
  const React = require('react');
  return {
    createNativeStackNavigator: () => {
      const Navigator = ({ children }) => React.createElement(React.Fragment, null, children);
      const Screen = () => null;
      return { Navigator, Screen };
    },
  };
});

// Mock React Native Firebase modules used in app
jest.mock('@react-native-firebase/app', () => ({ __esModule: true, default: () => ({}) }));

jest.mock('@react-native-firebase/auth', () => {
  const impl = () => ({
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
  return { __esModule: true, default: impl };
});

jest.mock('@react-native-firebase/firestore', () => {
  const FieldValue = { serverTimestamp: () => new Date() };
  const emptySnap = { docs: [], exists: false, data: () => ({}) };
  const impl = () => ({
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
  return { __esModule: true, default: impl };
});

jest.mock('@react-native-firebase/storage', () => {
  const impl = () => ({
    ref: () => ({
      putFile: jest.fn(async () => {}),
      getDownloadURL: jest.fn(async () => 'https://example.com/image.jpg'),
    }),
  });
  return { __esModule: true, default: impl };
});

// Stabilize color scheme in tests to avoid teardown warnings
try {
  // eslint-disable-next-line global-require
  const RN = require('react-native');
  if (RN && typeof RN.useColorScheme === 'function') {
    jest.spyOn(RN, 'useColorScheme').mockReturnValue('light');
  }
} catch (_e) {}

