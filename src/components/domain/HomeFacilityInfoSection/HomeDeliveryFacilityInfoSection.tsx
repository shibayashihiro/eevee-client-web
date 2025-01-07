import { OrderType } from '@/graphql/generated/types';

import { OrderTypeShopHeader } from './OrderTypeShopHeader';
import { HomeDeliveryFacilityInfoSectionFragment } from './HomeDeliveryFacilityInfoSection.fragment.generated';

type Props = {
  section: HomeDeliveryFacilityInfoSectionFragment;
};

export const HomeDeliveryFacilityInfoSection = ({ section }: Props) => (
  <OrderTypeShopHeader orderType={OrderType.Delivery} shopName={section.facility.shortName} />
);
