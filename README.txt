ANTIC R.O SYSTEM CRM — v22.26 PWA

Firebase-enabled build for GitHub Pages.
- Firebase Web App config is prefilled for project antic-ro-system-crm.
- Firebase Authentication (Email/Password) and Cloud Firestore are initialized through the Firebase compat SDK.
- Firestore data is scoped to the signed-in user's UID.
- Local browser storage remains enabled; cloud sync begins after successful Firebase login.

Read FIREBASE_SETUP.txt before first use. Enable Email/Password Authentication, create Firestore, and publish firestore.rules.
Keep index.html and the supplied assets in the same repository directory.
