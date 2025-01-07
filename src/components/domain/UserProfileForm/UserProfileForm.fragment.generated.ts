import gql from 'graphql-tag';

import * as Types from '../../../graphql/generated/types';

export type TenantUserProfileFormFieldsFragment = {
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

export type UserProfileFormInputFieldFragment = {
  __typename: 'UserProfileInputField';
  title: string;
  required: boolean;
  type: Types.UserProfileInputFieldType;
  values?: Array<string> | null;
  placeholder?: string | null;
  helpText?: string | null;
};

export const UserProfileFormInputFieldFragmentDoc = gql`
  fragment UserProfileFormInputField on UserProfileInputField {
    title
    required
    type
    values
    placeholder
    helpText
  }
`;
export const TenantUserProfileFormFieldsFragmentDoc = gql`
  fragment TenantUserProfileFormFields on Tenant {
    userProfileInputFields {
      ...UserProfileFormInputField
    }
  }
`;
