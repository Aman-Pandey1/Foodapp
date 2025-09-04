# Food Waste App (React Native + Firebase)

A simple food waste exchange app built with Expo React Native and Firebase. Supports two roles: Waste Suppliers and Compost Producers.

## Features
- Email/password auth with role selection (Supplier/Producer)
- Supplier: create listings with optional image upload
- Producer: browse available listings and contact suppliers via email
- Profile management: name, phone, location
- Polished UI with gradients and icons

## Getting Started
1) Install dependencies
```bash
npm install
```
2) Configure Firebase in `app.json` under `expo.extra.firebase`
```json
{
  "expo": {
    "extra": {
      "firebase": {
        "apiKey": "...",
        "authDomain": "...",
        "projectId": "...",
        "storageBucket": "...",
        "messagingSenderId": "...",
        "appId": "..."
      }
    }
  }
}
```
3) Run the app
```bash
npm run android
```

## Firestore Structure
- `users/{uid}`: { uid, email, displayName, role, phone, location }
- `listings/{id}`: { title, type, quantityKg, location, imageUrl, status, supplierId, createdAt }

## Example Firestore Rules
See `firestore.rules` in the project root. Apply them in Firebase Console > Firestore > Rules.

## Notes
- Image uploads use Expo ImagePicker and Firebase Storage
- Location is a simple text field; you can integrate `expo-location` later
- Targets Expo SDK 53, React 19, and React Native 0.79