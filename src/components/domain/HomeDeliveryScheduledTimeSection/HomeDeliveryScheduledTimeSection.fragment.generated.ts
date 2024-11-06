import gql from 'graphql-tag';
export type HomeDeliveryScheduledTimeSectionPartsFragment = {
  __typename: 'DeliverySection';
  scheduledTime: string;
  deliveryFeeAmount: string;
  caution?: string | null;
};

export const HomeDeliveryScheduledTimeSectionPartsFragmentDoc = gql`
  fragment HomeDeliveryScheduledTimeSectionParts on DeliverySection {
    scheduledTime
    deliveryFeeAmount
    caution
  }
`;
