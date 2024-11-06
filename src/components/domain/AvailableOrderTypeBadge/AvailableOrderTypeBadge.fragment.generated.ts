import gql from 'graphql-tag';

import * as Types from '../../../graphql/generated/types';

export type AvailableOrderTypeBadgePartsFragment = {
  __typename: 'AvailableOrderType';
  label: string;
  orderType: Types.OrderType;
};

export const AvailableOrderTypeBadgePartsFragmentDoc = gql`
  fragment AvailableOrderTypeBadgeParts on AvailableOrderType {
    label
    orderType
  }
`;
