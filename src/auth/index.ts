import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signInAnonymously,
  signInWithCustomToken,
  sendPasswordResetEmail,
  Auth as FirebaseAuth,
} from 'firebase/auth';
import liff from '@line/liff';

import { requestCustomTokenByLineIdToken } from './api';
import { FirebaseAuthError, FirebaseUser, SignInResult } from './types';
import { FirebaseAuthProject, getFirebaseAuth } from './instances';

export * from './types';

export type Auth = ReturnType<typeof getAuth>;

export const getAuth = (authProject: FirebaseAuthProject) => {
  const auth = getFirebaseAuth(authProject);
  return {
    getCurrentUser: () => auth.currentUser,
    signIn: (email: string, password: string) => handleSignIn(auth, email, password),
    signOut: () => auth.signOut(),
    signInAnonymously: () => signInAnonymously(auth),
    onAuthStateChanged: (callback: (user: FirebaseUser | null) => void) => onAuthStateChanged(auth, callback),
    sendPasswordResetEmail: (email: string) => handleSendPasswordResetEmail(auth, email),
    signInByLINE: (tenantId: string) => signInByLINE(auth, tenantId),
  } as const;
};

const handleSignIn = async (auth: FirebaseAuth, email: string, password: string): Promise<SignInResult> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      user: userCredential.user,
      err: null,
    };
  } catch (error: unknown) {
    const err = handleFirebaseAuthError(error);
    return { user: null, err };
  }
};

const handleSendPasswordResetEmail = async (auth: FirebaseAuth, email: string): Promise<Error | null> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: unknown) {
    return handleFirebaseAuthError(error);
  }
  return null;
};

const isFirebaseAuthError = (error: unknown): error is FirebaseAuthError => {
  if (error == null) {
    return false;
  }
  const e = error as Record<string, unknown>;
  return typeof e.code === 'string' && typeof e.message === 'string' && typeof e.name === 'string';
};

const handleFirebaseAuthError = (error: unknown): Error => {
  if (!isFirebaseAuthError(error)) {
    return new Error('予期せぬエラーが発生しました。');
  }
  switch (error.code) {
    case 'auth/invalid-email':
      return new Error('メールアドレスの形式が不正です');
    default:
      return new Error('ユーザーが存在しないか、入力内容が正しくありません。');
  }
};

const signInByLINE = async (auth: FirebaseAuth, tenantId: string) => {
  const lineIdToken = liff.getIDToken();
  const liffId = liff.id;
  if (!lineIdToken || !liffId) {
    throw new Error('LINEの情報を取得できませんでした');
  }
  const token = await requestCustomTokenByLineIdToken({
    tenantId,
    liffId,
    lineIdToken,
  });

  await signInWithCustomToken(auth, token);
};
