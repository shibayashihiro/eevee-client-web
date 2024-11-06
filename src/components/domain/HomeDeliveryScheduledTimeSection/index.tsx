import React, { FC, useCallback } from 'react';
import { Button, HStack, Text, VStack, Icon, Link } from '@chakra-ui/react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import variables from '@/styles/variables.module.scss';
import { HomeDeliveryScheduledTimeSectionPartsFragment } from '@/components/domain/HomeDeliveryScheduledTimeSection/HomeDeliveryScheduledTimeSection.fragment.generated';

type Props = {
  fragment?: HomeDeliveryScheduledTimeSectionPartsFragment;
};

export const HomeDeliveryScheduledTimeSection: FC<Props> = ({ fragment }: Props) => {
  const handleOnClick = useCallback(() => {
    // implement
  }, []);

  if (!fragment || fragment.scheduledTime == '' || fragment.deliveryFeeAmount == '') {
    return null;
  }
  return (
    <>
      <Button as="a" variant="outline" rounded="12px" h="125px" p="18px" mt="12px" w="full" onClick={handleOnClick}>
        <VStack w="full" alignItems="start">
          <Text className="bold-extra-small" color={variables.monoSecondary}>
            お届け時間
          </Text>
          <HStack>
            <Icon as={AccessTimeIcon} boxSize="20px" />
            <Text className="bold-small">{fragment.scheduledTime}</Text>
          </HStack>
          <HStack
            h="44px"
            p="14px"
            mt="10px"
            w="full"
            rounded="8px"
            backgroundColor="brand.backgroundSoft"
            justifyContent="space-between"
          >
            <Text className="bold-extra-small" color="brand.primaryText">
              配送手数料
            </Text>
            <Text className="bold-small" color="brand.primaryText">
              {fragment.deliveryFeeAmount}
            </Text>
          </HStack>
        </VStack>
      </Button>
      <HStack alignItems="center" spacing="4px" justifyContent="end" mt="12px">
        <Icon as={HelpOutlineIcon} color="brand.primaryText" boxSize="14px" />
        <Link href="https://chompy.notion.site/cd7fef0609a14bbdb6ac0980817501a9" isExternal>
          <Text className="text-extra-small" color="brand.primaryText">
            配送手数料について
          </Text>
        </Link>
      </HStack>
      {fragment.caution && (
        <Text className="text-extra-small" color="mono.secondary" pt="8px">
          {fragment.caution}
        </Text>
      )}
    </>
  );
};
