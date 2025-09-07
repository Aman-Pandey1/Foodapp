import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// Centralized Firebase module for React Native Firebase (JS API)
// React Native Firebase auto-initializes from native config:
// - Android: android/app/google-services.json
// - iOS: ios/GoogleService-Info.plist

const getCurrentUser = () => auth().currentUser;

const onAuthChanged = (callback) => auth().onAuthStateChanged(callback);

export { auth, firestore, storage, getCurrentUser, onAuthChanged };

