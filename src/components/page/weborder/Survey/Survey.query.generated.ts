import gql from 'graphql-tag';
import * as Urql from 'urql';

import { DateTime } from '@/graphql/generated/types';

import * as Types from '../../../../graphql/generated/types';
import {
  NavbarViewingPartsFragmentDoc,
  NavbarViewerPartsFragmentDoc,
  NavbarMenuViewerFragmentDoc,
} from '../../../domain/Navbar/Navbar.fragment.generated';
import { GeneralNavbarMenuViewerFragmentDoc } from '../../../domain/Navbar/GeneralNavbarMenu.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SurveyPageQueryVariables = Types.Exact<{
  surveyId: Types.Scalars['ID']['input'];
}>;

export type SurveyPageQuery = {
  __typename: 'Query';
  viewing: { __typename: 'Tenant'; logo: string };
  viewer: {
    __typename: 'User';
    profile?: { __typename: 'Profile'; imageUrl: string } | null;
    loyaltyCard?: { __typename: 'UserLoyaltyCard' } | null;
  };
  survey?:
    | { __typename: 'Cart' }
    | { __typename: 'Coupon' }
    | { __typename: 'CourseMenu' }
    | { __typename: 'CourseMenuCategory' }
    | { __typename: 'DeliveryOrder' }
    | { __typename: 'EatInOrder' }
    | { __typename: 'Facility' }
    | { __typename: 'MenuCategory' }
    | { __typename: 'MenuItem' }
    | {
        __typename: 'Survey';
        id: string;
        surveyConfig: {
          __typename: 'SurveyConfig';
          availableAt: DateTime;
          surveyForm: {
            __typename: 'SurveyForm';
            id: string;
            rows: Array<{
              __typename: 'SurveyFormRow';
              id: string;
              order: number;
              question: string;
              required: boolean;
              answerType: Types.AnswerType;
              answers: Array<string>;
            }>;
          };
        };
      }
    | { __typename: 'Table' }
    | { __typename: 'TableOrder' }
    | { __typename: 'TakeoutOrder' }
    | { __typename: 'Tenant' }
    | { __typename: 'User' }
    | null;
};

export const SurveyPageDocument = gql`
  query SurveyPage($surveyId: ID!) {
    viewing {
      ...NavbarViewingParts
    }
    viewer {
      ...NavbarViewerParts
    }
    survey: node(id: $surveyId) {
      ... on Survey {
        id
        surveyConfig {
          availableAt
          surveyForm {
            id
            rows {
              id
              order
              question
              required
              answerType
              answers
            }
          }
        }
      }
    }
  }
  ${NavbarViewingPartsFragmentDoc}
  ${NavbarViewerPartsFragmentDoc}
  ${NavbarMenuViewerFragmentDoc}
  ${GeneralNavbarMenuViewerFragmentDoc}
`;

export function useSurveyPageQuery(options: Omit<Urql.UseQueryArgs<SurveyPageQueryVariables>, 'query'>) {
  return Urql.useQuery<SurveyPageQuery, SurveyPageQueryVariables>({ query: SurveyPageDocument, ...options });
}
