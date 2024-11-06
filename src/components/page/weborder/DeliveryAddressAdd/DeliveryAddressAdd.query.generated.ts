import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
import { InputAddressesInitializePartsFragmentDoc } from '../../../domain/DeliveryAddressAdd/DeliveryAddressAdd.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetPlaceDetailsForInputAddressQueryVariables = Types.Exact<{
  placeId: Types.Scalars['String']['input'];
}>;

export type GetPlaceDetailsForInputAddressQuery = {
  __typename: 'Query';
  placeAddress: { __typename: 'PlaceAddress'; prefecture: string; addressLine: string };
};

export const GetPlaceDetailsForInputAddressDocument = gql`
  query GetPlaceDetailsForInputAddress($placeId: String!) {
    placeAddress(placeId: $placeId) {
      ...InputAddressesInitializeParts
    }
  }
  ${InputAddressesInitializePartsFragmentDoc}
`;

export function useGetPlaceDetailsForInputAddressQuery(
  options: Omit<Urql.UseQueryArgs<GetPlaceDetailsForInputAddressQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetPlaceDetailsForInputAddressQuery, GetPlaceDetailsForInputAddressQueryVariables>({
    query: GetPlaceDetailsForInputAddressDocument,
    ...options,
  });
}
