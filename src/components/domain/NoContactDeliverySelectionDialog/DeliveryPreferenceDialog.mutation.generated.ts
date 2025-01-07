import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UpdateNoContactDeliveryOptionMutationVariables = Types.Exact<{
  requestNoContactDelivery: Types.Scalars['Boolean']['input'];
}>;

export type UpdateNoContactDeliveryOptionMutation = {
  __typename: 'Mutation';
  updateNoContactDeliveryOption: {
    __typename: 'UpdateNoContactDeliveryOptionPayload';
    clientMutationId?: string | null;
    noContactDeliveryOption: { __typename: 'NoContactDeliveryOption'; requestNoContactDelivery: boolean };
  };
};

export const UpdateNoContactDeliveryOptionDocument = gql`
  mutation UpdateNoContactDeliveryOption($requestNoContactDelivery: Boolean!) {
    updateNoContactDeliveryOption(input: { requestNoContactDelivery: $requestNoContactDelivery }) {
      clientMutationId
      noContactDeliveryOption {
        requestNoContactDelivery
      }
    }
  }
`;

export function useUpdateNoContactDeliveryOptionMutation() {
  return Urql.useMutation<UpdateNoContactDeliveryOptionMutation, UpdateNoContactDeliveryOptionMutationVariables>(
    UpdateNoContactDeliveryOptionDocument,
  );
}
