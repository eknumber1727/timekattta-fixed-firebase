import { initializeApp, getApp } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js';
import { firebaseConfig } from '../firebase.js';

function app() { try { return getApp(); } catch { return initializeApp(firebaseConfig); } }

export async function uploadFile(file, pathPrefix='uploads') {
  const storage = getStorage(app());
  const key = `${pathPrefix}/${Date.now()}-${file.name}`;
  const fileRef = ref(storage, key);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  return { key, url };
}

export async function listUploads(pathPrefix='uploads') {
  const storage = getStorage(app());
  const rootRef = ref(storage, pathPrefix);
  const res = await listAll(rootRef);
  return res.items;
}

export async function deleteByPath(fullPath) {
  const storage = getStorage(app());
  const r = ref(storage, fullPath);
  await deleteObject(r);
}
