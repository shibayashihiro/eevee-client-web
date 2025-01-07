import React, { FC } from 'react';
import { Box, Text, Flex, Icon } from '@chakra-ui/react';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { OrderDetailPartsFragment } from '@/components/domain/OrderDetail/OrderDetail.fragment.generated';
import { isDeliveryOrder } from '@/graphql/helper';
import variables from '@/styles/variables.module.scss';
import { toFullAddress } from '@/utils/formatUtils';
import { FacilityLocationMap } from '@/components/domain/FacilityLocationMap';

import { OrderItemsSummary } from './OrderItemsSummary';

type Props = {
  fragment: OrderDetailPartsFragment;
  showShortIds?: boolean;
  showFacilityLocationMap?: boolean;
};

export const OrderDetail: FC<Props> = ({ fragment, showShortIds, showFacilityLocationMap }: Props) => {
  const onClickFacilityLocation = (facilityName: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${facilityName}`);
  };

  return (
    <Box pt="40px">
      <Text className="bold-3xl" pb="16px">
        {fragment.facility.name}
      </Text>

      {showFacilityLocationMap && (
        <>
          <FacilityLocationMap
            location={{
              lat: fragment.facility.latLng.latitude,
              lng: fragment.facility.latLng.longitude,
            }}
          />
          <Flex
            justifyContent="end"
            direction="row"
            w="full"
            pt="16px"
            pb="16px"
            onClick={() => onClickFacilityLocation(fragment.facility.name)}
          >
            <Icon as={LocationOnIcon} color="brand.primaryText" w="16px" h="16px" />
            <Text color="brand.primaryText" className="text-extra-small" ml="4px">
              お店の場所を確認する
            </Text>
          </Flex>
        </>
      )}

      {isDeliveryOrder(fragment) && (
        <Box pb="16px">
          <Text className="bold-extra-small" pb="8px" color={variables.monoSecondary}>
            お届け先
          </Text>
          <Text className="bold-small">
            {toFullAddress(
              fragment.deliveryAddress.prefecture,
              fragment.deliveryAddress.addressLine,
              fragment.deliveryAddress.buildingName,
              fragment.deliveryAddress.roomNumber,
            )}
          </Text>
          {fragment.deliveryAddress.memo != null && (
            <Text className="text-extra-small">{fragment.deliveryAddress.memo}</Text>
          )}
        </Box>
      )}

      {showShortIds && (
        <Box pt="8px" pb="16px">
          <Text className="bold-extra-small" pb="4px" color={variables.monoSecondary}>
            お届け番号
          </Text>
          <Text className="bold-small">{fragment.shortIds.join(', ')}</Text>
        </Box>
      )}

      <OrderItemsSummary order={fragment} />
    </Box>
  );
};
