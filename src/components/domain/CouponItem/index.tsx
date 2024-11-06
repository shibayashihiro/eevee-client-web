import React, { FC } from 'react';
import { HStack, Icon, Text, VStack } from '@chakra-ui/react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { CouponItemPartsFragment } from '@/components/domain/CouponItem/CouponItem.fragment.generated';

type Props = {
  fragment: CouponItemPartsFragment;
  selected: boolean;
  onClickSelect?: (id: string) => void;
};

export const CouponItem: FC<Props> = ({ fragment, selected, onClickSelect }) => {
  const handleOnClickSelect = () => {
    if (!onClickSelect) return;

    onClickSelect(fragment.id);
  };

  return (
    <>
      <VStack borderRadius="8px" align="start" bgColor="brand.background" pb="16px" onClick={handleOnClickSelect}>
        {/* TODO: 端の半円 */}
        <HStack
          justify="space-between"
          w="full"
          borderStyle="dotted"
          borderColor="mono.white"
          borderBottomWidth="3px"
          borderRadius={1}
          px="20px"
          py="16px"
        >
          <Text className="bold-32px" color="mono.white">
            {fragment.title}
          </Text>
          <Icon as={CheckCircleIcon} w="32px" h="32px" color="mono.white" opacity={selected ? 1 : 0.4} />
        </HStack>
        <VStack px="20px" pt="12px" color="mono.white" align="start" spacing="2px">
          <Text className="bold-extra-small">{fragment.subTitle}</Text>
          {fragment.details.map((detail, index) => (
            <Text className="text-extra-small" key={index}>
              {detail.name}: {detail.value}
            </Text>
          ))}
        </VStack>
      </VStack>
    </>
  );
};
