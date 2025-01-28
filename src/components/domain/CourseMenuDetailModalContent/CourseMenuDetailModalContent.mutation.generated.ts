import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AddCourseMenuMutationVariables = Types.Exact<{
  input: Types.AddCourseMenuToCartInput;
}>;

export type AddCourseMenuMutation = {
  __typename: 'Mutation';
  addCourseMenuToCart: { __typename: 'AddCourseMenuToCartPayload'; cart: { __typename: 'Cart' } };
};

export type UpdateCourseMenuMutationVariables = Types.Exact<{
  input: Types.ModifyCourseMenuOnCartInput;
}>;

export type UpdateCourseMenuMutation = {
  __typename: 'Mutation';
  modifyCourseMenuOnCart: { __typename: 'ModifyCourseMenuOnCartPayload'; cart: { __typename: 'Cart' } };
};

export const AddCourseMenuDocument = gql`
  mutation AddCourseMenu($input: AddCourseMenuToCartInput!) {
    addCourseMenuToCart(input: $input) {
      cart {
        __typename
      }
    }
  }
`;

export function useAddCourseMenuMutation() {
  return Urql.useMutation<AddCourseMenuMutation, AddCourseMenuMutationVariables>(AddCourseMenuDocument);
}
export const UpdateCourseMenuDocument = gql`
  mutation UpdateCourseMenu($input: ModifyCourseMenuOnCartInput!) {
    modifyCourseMenuOnCart(input: $input) {
      cart {
        __typename
      }
    }
  }
`;

export function useUpdateCourseMenuMutation() {
  return Urql.useMutation<UpdateCourseMenuMutation, UpdateCourseMenuMutationVariables>(UpdateCourseMenuDocument);
}
