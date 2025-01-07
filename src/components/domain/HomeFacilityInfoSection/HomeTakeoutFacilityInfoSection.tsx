import { Button, HStack } from '@chakra-ui/react';

import { OrderType } from '@/graphql/generated/types';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { shopListPage } from '@/utils/paths/tenantPages';

import { HomeTakeoutFacilityInfoSectionFragment } from './HomeTakeoutFacilityInfoSection.fragment.generated';
import { OrderTypeShopHeader } from './OrderTypeShopHeader';

type Props = {
  section: HomeTakeoutFacilityInfoSectionFragment;
};

export const HomeTakeoutFacilityInfoSection = ({ section }: Props) => {
  return (
    <HStack justifyContent="space-between">
      <OrderTypeShopHeader orderType={OrderType.Takeout} shopName={section.facility.shortName} />
      <ChangeFacilityButton />
    </HStack>
  );
};

export const ChangeFacilityButton = () => {
  const router = useTenantRouter();
  return (
    <Button variant="primary" h="32px" w="88px" onClick={() => router.push(shopListPage)}>
      変更する
    </Button>
  );
};
