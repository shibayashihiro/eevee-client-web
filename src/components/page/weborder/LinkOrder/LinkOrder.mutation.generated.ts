import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type LinkOrderMutationVariables = Types.Exact<{
  input: Types.LinkOrderInput;
}>;

export type LinkOrderMutation = {
  __typename: 'Mutation';
  linkOrder: {
    __typename: 'LinkOrderPayload';
    clientMutationId?: string | null;
    resultMainText: string;
    resultSubText?: string | null;
    cautionText?: string | null;
  };
};

export const LinkOrderDocument = gql`
  mutation LinkOrder($input: LinkOrderInput!) {
    linkOrder(input: $input) {
      clientMutationId
      resultMainText
      resultSubText
      cautionText
    }
  }
`;

export function useLinkOrderMutation() {
  return Urql.useMutation<LinkOrderMutation, LinkOrderMutationVariables>(LinkOrderDocument);
}
