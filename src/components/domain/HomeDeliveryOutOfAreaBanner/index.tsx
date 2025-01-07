import { Button, Spacer, Text, useDisclosure, VStack } from '@chakra-ui/react';
import React, { FC, useCallback } from 'react';

import { DeliveryFacilityListDialog } from '@/components/domain/DeliveryFacilityListDialog';
import { LatLng } from '@/graphql/generated/types';
import { HomeDeliveryOutOfAreaBannerPartsFragment } from '@/components/domain/HomeDeliveryOutOfAreaBanner/HomeDeliveryOutOfAreaBanner.fragment.generated';

type Props = {
  fragment?: HomeDeliveryOutOfAreaBannerPartsFragment;
};

export const HomeDeliveryOutOfAreaBanner: FC<Props> = ({ fragment }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOnClick = useCallback(() => {
    onOpen();
  }, [onOpen]);

  return (
    <>
      <DeliveryFacilityListDialog
        isOpen={isOpen}
        onClose={onClose}
        latLng={fragment ? fragment.latLng : ({ latitude: 0, longitude: 0 } as LatLng)}
      />
      <VStack
        backgroundColor="mono.primary"
        borderRadius="12px"
        alignItems="left"
        spacing="0px"
        p="16px"
        w="full"
        h="114px"
      >
        <Text color="mono.white" className="bold-small">
          配達エリア外
        </Text>
        <Text color="mono.white" className="bold-extra-small" mt="2px">
          現在設定されているお届け先には配達できません
        </Text>
        <Spacer mt="12px" />
        <Button rounded="20px" variant="outline" h="32px" w="full" onClick={handleOnClick}>
          <Text color="mono.white" className="bold-extra-small">
            配達できるお店をさがす
          </Text>
        </Button>
      </VStack>
    </>
  );
};
