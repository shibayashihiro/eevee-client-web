import gql from 'graphql-tag';

import * as Types from '../../../graphql/generated/types';

export type SelectOrderTypeSectionPartsFragment = {
  __typename: 'SelectOrderTypeSection';
  orderTypes: Array<Types.OrderType>;
};

export const SelectOrderTypeSectionPartsFragmentDoc = gql`
  fragment SelectOrderTypeSectionParts on SelectOrderTypeSection {
    orderTypes
  }
`;
