import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RemoveCartCourseMenuItemMutationVariables = Types.Exact<{
  input: Types.RemoveCourseMenuItemFromCartInput;
}>;

export type RemoveCartCourseMenuItemMutation = {
  __typename: 'Mutation';
  removeCourseMenuItemFromCart: { __typename: 'RemoveCourseMenuItemFromCartPayload'; cart: { __typename: 'Cart' } };
};

export const RemoveCartCourseMenuItemDocument = gql`
  mutation RemoveCartCourseMenuItem($input: RemoveCourseMenuItemFromCartInput!) {
    removeCourseMenuItemFromCart(input: $input) {
      cart {
        __typename
      }
    }
  }
`;

export function useRemoveCartCourseMenuItemMutation() {
  return Urql.useMutation<RemoveCartCourseMenuItemMutation, RemoveCartCourseMenuItemMutationVariables>(
    RemoveCartCourseMenuItemDocument,
  );
}
