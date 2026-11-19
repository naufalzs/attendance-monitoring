import { initializeApp } from 'firebase/app'
import { inMemoryPersistence, initializeAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
})

export const firebaseAuth = initializeAuth(app, { persistence: inMemoryPersistence })
export const firestore = getFirestore(app)
