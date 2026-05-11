# MotionZync 🎨

Live CSS + JS Animation Playground with Firestore backend.

## Vercel Environment Variables

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_ADMIN_EMAIL=you@gmail.com
VITE_ADSENSE_CLIENT=ca-pub-XXXXXXXX
VITE_ADSENSE_SLOT_HOME=
VITE_ADSENSE_SLOT_GALLERY=
VITE_ADSENSE_SLOT_PLAYGROUND=
```

## Firebase Setup

1. Firebase Console → New Project → "MotionZync"
2. Firestore Database → Create (production mode)
3. Authentication → Sign-in method → Google → Enable
4. Project Settings → Web App → Config values copy karo

## Firestore Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /animations/{doc} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == "YOUR_GMAIL";
    }
    match /categories/{doc} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == "YOUR_GMAIL";
    }
  }
}
```

## Admin Access

- Logo par 7 tap karo → /admin khulshe
- Ya seedha /admin URL kholvo
- Google thi login karo (sirf VITE_ADMIN_EMAIL valo access milshe)
- 
