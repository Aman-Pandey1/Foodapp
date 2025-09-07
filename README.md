# Food App (React Native + Firebase) - JavaScript

This scaffolds Firebase-backed auth, foods CRUD with image upload, favorites, cart, and orders using React Native Firebase (plain JS, not TypeScript).

## Included
- `src/firebase`: Firebase wrapper
- `src/services/auth.js`: register/login/logout/profile
- `src/services/foods.js`: CRUD + Storage upload + favorites
- `src/services/cartOrders.js`: Cart + Orders
- `src/App.js` + `src/screens/*`: Example screens with React Navigation
- `firebase/firestore.rules` and `firebase/storage.rules`: Security rules

## Install dependencies
```bash
# React Native Firebase
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore @react-native-firebase/storage

# React Navigation
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context

# Image picker (for uploads)
npm install react-native-image-picker
```

## Android: where to put google-services.json
- Put your Firebase Android config file at:
  - `android/app/google-services.json`
- Ensure Gradle is configured:
```gradle
// android/build.gradle
buildscript {
  dependencies {
    classpath('com.google.gms:google-services:4.4.2')
  }
}

// android/app/build.gradle
apply plugin: 'com.google.gms.google-services'
```

## iOS (if building for iOS)
- Add `GoogleService-Info.plist` to your iOS app target in `ios/`.
- Then run:
```bash
cd ios && pod install && cd ..
```

## Use the provided code
- Copy `src/` and `firebase/` directories into your project root.
- Use `src/App.js` as your app entry or integrate screens/services into your app.
- Ensure your `index.js` exports the `App` from `src/App.js` or integrates it.

## Firebase console setup needed
- Enable Authentication → Email/Password.
- Create Firestore (Production mode recommended).
- Create Storage bucket.
- Deploy rules:
```bash
# After installing Firebase CLI and selecting your project (foodapp-1181f)
# firebase use foodapp-1181f
firebase deploy --only firestore:rules,storage:rules
```

## Important notes about your JSON
- Do NOT paste the JSON into your JavaScript code.
- React Native Firebase reads native config files:
  - Android: `android/app/google-services.json`
  - iOS: `ios/GoogleService-Info.plist`
- Your posted values (project_id, api key, etc.) should match the file you download from Firebase Console for `com.foodwasteapp`.

## Collections used
- `users/{uid}`: profile fields, `favorites: []`
- `foods/{foodId}`: `ownerId`, `title`, `description`, `price`, `category`, `imageURL`
- `carts/{uid}/items/{foodId}`: `qty`, `title`, `price`, `imageURL`
- `orders/{orderId}`: `userId`, `items[]`, `subtotal`, `status`

## Screens provided
- Login/Register: email/password
- Home: list foods, navigate to detail, go to Add, Cart, Profile
- AddFood: create food with image upload
- FoodDetail: add to cart, toggle favorite
- Cart: adjust qty, checkout creates an order
- Profile: update display name, logout

## Your Firebase project values
```
project_id: foodapp-1181f
project_number: 256535913983
storage_bucket: foodapp-1181f.firebasestorage.app
android package: com.foodwasteapp
app id: 1:256535913983:android:6cac507eb6bd63ec1473ca
api key: AIzaSyA79QYR0LeNLo4BN9iFthBWzHDhg1B1W3c
```
Make sure the Android package matches in Firebase Console and `applicationId` in `android/app/build.gradle`.

## Run
```bash
npm run android
# or
npm run ios
```

If you get permission or rules errors, ensure you are signed in and the Firestore/Storage rules have been deployed.
