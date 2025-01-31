import { HStack, VStack, Text, MenuItem, Menu, MenuList, MenuButton, IconButton } from '@chakra-ui/react';

import { OrderType } from '@/graphql/generated/types';
import { TableNumber } from '@/components/ui/TableNumber';
import { BellIcon } from '@/components/ui/Icons/BellIcon';
import { ChevronDownIcon } from '@/components/ui/Icons/ChevronDownIcon';
import { GlobeIcon } from '@/components/ui/Icons/GlobeIcon';

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
      <VStack spacing="0px" ml="4px" align="start">
        <OrderTypeShopHeader orderType={OrderType.EatIn} shopName={section.facility.shortName} />
        {table && <TableNumber tableName={table.name} />}
      </VStack>
      <HStack spacing="24px">
        <VStack spacing="0px">
          <BellIcon boxSize="24px" color="mono.primary" />
          <Text className="text-micro">呼出</Text>
        </VStack>
        <VStack spacing="0px">
          <Menu>
            <MenuButton
              as={IconButton}
              variant="ghost"
              aria-label="Globe dropdown"
              icon={
                <HStack spacing="2px" px="6px" py="12px">
                  <GlobeIcon boxSize="20px" color="mono.primary" />
                  <ChevronDownIcon boxSize="16px" color="mono.secondary" />
                </HStack>
              }
              minH="44px"
              borderRadius="8px"
              bg="mono.backGround"
            />
            <MenuList>
              <MenuItem>日本語</MenuItem>
              <MenuItem>English</MenuItem>
            </MenuList>
          </Menu>
        </VStack>
      </HStack>
    </HStack>
  );
};
