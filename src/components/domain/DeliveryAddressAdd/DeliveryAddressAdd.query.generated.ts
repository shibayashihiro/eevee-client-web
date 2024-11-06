import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetPlacePredictionsQueryVariables = Types.Exact<{
  keyword: Types.Scalars['String']['input'];
}>;

export type GetPlacePredictionsQuery = {
  __typename: 'Query';
  placePredictions: Array<{ __typename: 'PlacePrediction'; placeId: string; mainText: string; secondaryText: string }>;
};

export const GetPlacePredictionsDocument = gql`
  query GetPlacePredictions($keyword: String!) {
    placePredictions(keyword: $keyword) {
      placeId
      mainText
      secondaryText
    }
  }
`;

export function useGetPlacePredictionsQuery(
  options: Omit<Urql.UseQueryArgs<GetPlacePredictionsQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetPlacePredictionsQuery, GetPlacePredictionsQueryVariables>({
    query: GetPlacePredictionsDocument,
    ...options,
  });
}
