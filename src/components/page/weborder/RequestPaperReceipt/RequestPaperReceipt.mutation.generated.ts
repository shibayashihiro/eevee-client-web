import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SubmitRequestPaperReceiptMutationVariables = Types.Exact<{
  input: Types.UpdatePaperReceiptRequestInput;
}>;

export type SubmitRequestPaperReceiptMutation = {
  __typename: 'Mutation';
  updateReceiptRequest: {
    __typename: 'UpdatePaperReceiptPayload';
    paperReceiptRequest?: { __typename: 'PaperReceiptRequest' } | null;
  };
};

export const SubmitRequestPaperReceiptDocument = gql`
  mutation SubmitRequestPaperReceipt($input: UpdatePaperReceiptRequestInput!) {
    updateReceiptRequest(input: $input) {
      paperReceiptRequest {
        __typename
      }
    }
  }
`;

export function useSubmitRequestPaperReceiptMutation() {
  return Urql.useMutation<SubmitRequestPaperReceiptMutation, SubmitRequestPaperReceiptMutationVariables>(
    SubmitRequestPaperReceiptDocument,
  );
}
