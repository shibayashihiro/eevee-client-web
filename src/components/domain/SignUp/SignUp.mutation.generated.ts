import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequestAuthCodeBySmsMutationVariables = Types.Exact<{
  input: Types.RequestAuthCodeBySmsInput;
}>;

export type RequestAuthCodeBySmsMutation = {
  __typename: 'Mutation';
  requestAuthCodeBySMS: { __typename: 'RequestAuthCodeBySMSPayload'; clientMutationId?: string | null };
};

export type RequestAuthCodeByPhoneMutationVariables = Types.Exact<{
  input: Types.RequestAuthCodeByPhoneInput;
}>;

export type RequestAuthCodeByPhoneMutation = {
  __typename: 'Mutation';
  requestAuthCodeByPhone: { __typename: 'RequestAuthCodeByPhonePayload'; clientMutationId?: string | null };
};

export type VerifyAuthCodeMutationVariables = Types.Exact<{
  input: Types.VerifySmsAuthCodeInput;
}>;

export type VerifyAuthCodeMutation = {
  __typename: 'Mutation';
  verifySMSAuthCode: { __typename: 'VerifySMSAuthCodePayload'; clientMutationId?: string | null };
};

export type SignUpMutationVariables = Types.Exact<{
  input: Types.SignUpInput;
}>;

export type SignUpMutation = {
  __typename: 'Mutation';
  signUp: { __typename: 'SignUpPayload'; clientMutationId?: string | null };
};

export const RequestAuthCodeBySmsDocument = gql`
  mutation RequestAuthCodeBySMS($input: RequestAuthCodeBySMSInput!) {
    requestAuthCodeBySMS(input: $input) {
      clientMutationId
    }
  }
`;

export function useRequestAuthCodeBySmsMutation() {
  return Urql.useMutation<RequestAuthCodeBySmsMutation, RequestAuthCodeBySmsMutationVariables>(
    RequestAuthCodeBySmsDocument,
  );
}
export const RequestAuthCodeByPhoneDocument = gql`
  mutation RequestAuthCodeByPhone($input: RequestAuthCodeByPhoneInput!) {
    requestAuthCodeByPhone(input: $input) {
      clientMutationId
    }
  }
`;

export function useRequestAuthCodeByPhoneMutation() {
  return Urql.useMutation<RequestAuthCodeByPhoneMutation, RequestAuthCodeByPhoneMutationVariables>(
    RequestAuthCodeByPhoneDocument,
  );
}
export const VerifyAuthCodeDocument = gql`
  mutation VerifyAuthCode($input: VerifySMSAuthCodeInput!) {
    verifySMSAuthCode(input: $input) {
      clientMutationId
    }
  }
`;

export function useVerifyAuthCodeMutation() {
  return Urql.useMutation<VerifyAuthCodeMutation, VerifyAuthCodeMutationVariables>(VerifyAuthCodeDocument);
}
export const SignUpDocument = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      clientMutationId
    }
  }
`;

export function useSignUpMutation() {
  return Urql.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument);
}
