import { Text, Badge, HStack, Spacer, LinkBox, LinkOverlay, useDisclosure } from '@chakra-ui/react';
import React, { FC, useCallback } from 'react';

import { LatLng, OrderType } from '@/graphql/generated/types';
import { DeliveryAddressDialog } from '@/components/domain/DeliveryAddressDialog';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { shopListPage } from '@/utils/paths/tenantPages';
import { TableNumber } from '@/components/ui/TableNumber';
import { FacilityName } from '@/components/ui/FacilityName';

import { DeliveryFacilityListDialog } from '../DeliveryFacilityListDialog';

import {
  HomeFacilityInfoSectionCurrentTablePartsFragment,
  HomeFacilityInfoSectionPartsFragment,
} from './HomeFacilityInfoSection.fragment.generated';

export * from './HomeFacilityInfoSection.fragment.generated';

type Props = {
  facilityInfoSection: HomeFacilityInfoSectionPartsFragment;
  table?: HomeFacilityInfoSectionCurrentTablePartsFragment | null;
  orderType: OrderType;
  usingDeliveryAddressLatLng?: LatLng;
};

export const HomeFacilityInfoSection: FC<Props> = ({
  facilityInfoSection,
  table,
  orderType,
  usingDeliveryAddressLatLng,
}: Props) => {
  const { facility, hasOtherFacilities } = facilityInfoSection;
  const facilityListDialogState = useDisclosure();
  const deliveryAddressDialogState = useDisclosure();
  const router = useTenantRouter();

  const handleClickOtherShopsCommon = useCallback(async () => {
    await router.push(shopListPage);
  }, [router]);

  const handleClickOtherShopsOnDelivery = useCallback(() => {
    if (!usingDeliveryAddressLatLng) {
      deliveryAddressDialogState.onOpen();
      return;
    }
    facilityListDialogState.onOpen();
  }, [deliveryAddressDialogState, facilityListDialogState, usingDeliveryAddressLatLng]);

  const isDelivery = orderType === OrderType.Delivery;

  const handleClickOtherShops = isDelivery ? handleClickOtherShopsOnDelivery : handleClickOtherShopsCommon;

  return (
    <>
      <HStack w="full" alignItems="center">
        <FacilityName facilityName={facility.shortName} />
        <Spacer />
        {table && <TableNumber tableName={table.name} />}
        {/* TODO: LINEミニアプリの時は店舗選択できないと詰むが、一旦デモでは後払い=1店舗のみブランドなので、テーブルがある場合はほかの店舗を表示しない */}
        {!table && hasOtherFacilities && (
          <LinkBox>
            <LinkOverlay href="#" onClick={handleClickOtherShops}>
              <Badge px="12px" py="8px" bg="brand.primary" rounded="16px">
                <Text className="bold-extra-small" color="mono.white">
                  ほかの店舗
                </Text>
              </Badge>
            </LinkOverlay>
          </LinkBox>
        )}
      </HStack>
      {isDelivery && hasOtherFacilities && (
        <>
          <DeliveryFacilityListDialog
            isOpen={facilityListDialogState.isOpen}
            onClose={facilityListDialogState.onClose}
            latLng={usingDeliveryAddressLatLng ? usingDeliveryAddressLatLng : ({ latitude: 0, longitude: 0 } as LatLng)}
          />
          <DeliveryAddressDialog
            isOpen={deliveryAddressDialogState.isOpen}
            onClose={deliveryAddressDialogState.onClose}
            fragment={[]}
          />
        </>
      )}
    </>
  );
};
