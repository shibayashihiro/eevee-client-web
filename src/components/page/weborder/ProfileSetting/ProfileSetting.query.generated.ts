import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
import {
  TenantUserProfileFormFieldsFragmentDoc,
  UserProfileFormInputFieldFragmentDoc,
} from '../../../domain/UserProfileForm/UserProfileForm.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetUserProfileSettingFieldsQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetUserProfileSettingFieldsQuery = {
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
  viewer: {
    __typename: 'User';
    profile?: {
      __typename: 'Profile';
      displayName: string;
      lastNameKana?: string | null;
      gender?: string | null;
      birthDate?: { __typename: 'UserProfileBirthDate'; year: number; month: number; day: number } | null;
    } | null;
  };
};

export const GetUserProfileSettingFieldsDocument = gql`
  query GetUserProfileSettingFields {
    tenant: viewing {
      ...TenantUserProfileFormFields
    }
    viewer {
      profile {
        displayName
        lastNameKana
        gender
        birthDate {
          year
          month
          day
        }
      }
    }
  }
  ${TenantUserProfileFormFieldsFragmentDoc}
  ${UserProfileFormInputFieldFragmentDoc}
`;

export function useGetUserProfileSettingFieldsQuery(
  options?: Omit<Urql.UseQueryArgs<GetUserProfileSettingFieldsQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetUserProfileSettingFieldsQuery, GetUserProfileSettingFieldsQueryVariables>({
    query: GetUserProfileSettingFieldsDocument,
    ...options,
  });
}
