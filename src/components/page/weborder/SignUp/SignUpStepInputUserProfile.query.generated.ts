import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
import {
  TenantUserProfileFormFieldsFragmentDoc,
  UserProfileFormInputFieldFragmentDoc,
} from '../../../domain/UserProfileForm/UserProfileForm.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetUserProfileInputFieldsQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetUserProfileInputFieldsQuery = {
  __typename: 'Query';
  tenant: {
    __typename: 'Tenant';
    userProfileInputFields: Array<{
      __typename: 'UserProfileInputField';
      title: string;
      required: boolean;
      type: Types.UserProfileInputFieldType;
      values?: Array<string> | null;
      placeholder?: string | null;
      helpText?: string | null;
    }>;
  };
};

export const GetUserProfileInputFieldsDocument = gql`
  query GetUserProfileInputFields {
    tenant: viewing {
      ...TenantUserProfileFormFields
    }
  }
  ${TenantUserProfileFormFieldsFragmentDoc}
  ${UserProfileFormInputFieldFragmentDoc}
`;

export function useGetUserProfileInputFieldsQuery(
  options?: Omit<Urql.UseQueryArgs<GetUserProfileInputFieldsQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetUserProfileInputFieldsQuery, GetUserProfileInputFieldsQueryVariables>({
    query: GetUserProfileInputFieldsDocument,
    ...options,
  });
}
