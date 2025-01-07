import { HStack } from '@chakra-ui/react';

import { OrderType } from '@/graphql/generated/types';
import { TableNumber } from '@/components/ui/TableNumber';

import { OrderTypeShopHeader } from './OrderTypeShopHeader';
import {
  HomeEatInFacilityInfoSectionFragment,
  HomeEatInFacilityInfoSectionTableFragment,
} from './HomeEatInFacilityInfoSection.fragment.generated';

type Props = {
  section: HomeEatInFacilityInfoSectionFragment;
  table: HomeEatInFacilityInfoSectionTableFragment | null;
};

export const HomeEatInFacilityInfoSection = ({ section, table }: Props) => {
  return (
    <HStack justifyContent="space-between">
      <OrderTypeShopHeader orderType={OrderType.EatIn} shopName={section.facility.shortName} />
      {table && <TableNumber tableName={table.name} />}
    </HStack>
  );
};
