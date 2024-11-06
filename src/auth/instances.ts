import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import { firebaseApp } from '../utils/firebase';

export type FirebaseAuthProject = keyof typeof firebaseAuths;

const buildAuth = (name: string, firebaseOption: FirebaseOptions) => getAuth(initializeApp(firebaseOption, name));

const firebaseAuths = {
  default: getAuth(firebaseApp),
  'napoli-pizza': buildAuth('napoli-pizza', {
    apiKey: process.env.NEXT_PUBLIC_NAPOLI_PIZZA_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_NAPOLI_PIZZA_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_NAPOLI_PIZZA_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_NAPOLI_PIZZA_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_NAPOLI_PIZZA_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_NAPOLI_PIZZA_FIREBASE_APP_ID,
  }),
} as const;

export const getFirebaseAuth = (authProject: FirebaseAuthProject) => firebaseAuths[authProject];
