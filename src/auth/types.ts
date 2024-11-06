import type { User } from 'firebase/auth';

export type { FirebaseAuthProject } from './instances';

export type FirebaseUser = User;

// ref: https://firebase.google.cn/docs/reference/js/v8/firebase.auth.Error
export type FirebaseAuthError = {
  // ref: https://firebase.google.com/docs/reference/js/auth#autherrorcodes
  code: string;
  message: string;
  name: string;
};

export type SignInSucceed = {
  user: FirebaseUser;
  err: null;
};

export type SignInFailed = {
  user: null;
  err: Error;
};

export type SignInResult = SignInSucceed | SignInFailed;
