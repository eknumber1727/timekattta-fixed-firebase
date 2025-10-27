# Timepass Katta App – Firebase Integrated (No Login + Secret Admin)

Added files:
- `js/firebase.js` with your config
- `js/modules/auth.js` (Firebase Email/Password for admin portal)
- `js/modules/storage.js` (upload/list/delete)
- `upload-test.html` public page for quick Storage test
- `tpk-dev-zone/` secret admin portal (requires Email/Password login)

Admin steps:
1) Enable Email/Password in Firebase Authentication.
2) Create admin user (email+password).
3) Open `/tpk-dev-zone/` and login.

Deploy:
- Push to GitHub and connect to Netlify (no build step).

Security:
- Storage is currently in TEST mode for easy uploads. Tighten rules before production.
