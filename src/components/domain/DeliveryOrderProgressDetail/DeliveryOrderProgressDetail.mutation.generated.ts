import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequestProxyPhoneNumberMutationVariables = Types.Exact<{
  input: Types.RequestProxyPhoneNumberInput;
}>;

export type RequestProxyPhoneNumberMutation = {
  __typename: 'Mutation';
  requestProxyPhoneNumber: { __typename: 'RequestProxyPhoneNumberPayload'; phoneNumber: string };
};

export const RequestProxyPhoneNumberDocument = gql`
  mutation RequestProxyPhoneNumber($input: RequestProxyPhoneNumberInput!) {
    requestProxyPhoneNumber(input: $input) {
      phoneNumber
    }
  }
`;

export function useRequestProxyPhoneNumberMutation() {
  return Urql.useMutation<RequestProxyPhoneNumberMutation, RequestProxyPhoneNumberMutationVariables>(
    RequestProxyPhoneNumberDocument,
  );
}
