import { initializeApp, getApp } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';
import { firebaseConfig } from '../firebase.js';

let app, auth;

export function ensureApp() {
  try { app = getApp(); } catch { app = initializeApp(firebaseConfig); }
  if (!auth) auth = getAuth();
  return { app, auth };
}

export function watchAuth(callback) {
  ensureApp();
  return onAuthStateChanged(auth, callback);
}

export function emailPasswordLogin(email, password) {
  ensureApp();
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  ensureApp();
  return signOut(auth);
}
