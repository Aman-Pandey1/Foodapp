import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// Centralized Firebase module for React Native Firebase (JS API)
// React Native Firebase auto-initializes from native config:
// - Android: android/app/google-services.json
// - iOS: ios/GoogleService-Info.plist

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
    // Fallback to emit null once and noop unsubscribe
    setTimeout(() => callback(null), 0);
    return () => {};
  }
};

export { auth, firestore, storage, getCurrentUser, onAuthChanged };

