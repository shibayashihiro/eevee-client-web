import React, { FC } from 'react';
import { Center, HStack, Image, ListItem, Text, UnorderedList, VStack } from '@chakra-ui/react';

import { Promotion } from '@/graphql/generated/types';

type Props = {
  promotion: Promotion;
};

export const AppPromotion: FC<Props> = ({ promotion }: Props) => {
  return (
    <>
      <Text className="bold-medium" color="brand.primary" mb="24px" align="center">
        {promotion.title}
      </Text>
      <UnorderedList styleType="none" marginStart="0px" spacing="24px">
        {promotion.items.map((item, index) => (
          <ListItem key={index}>
            <HStack align="top" spacing="0px">
              <Center boxSize="48px" backgroundColor="brand.primary" flexShrink={0} borderRadius="24px" mr="12px">
                <Image src={item.icon} alt="PromotionItemIcon" h="24px" />
              </Center>
              <VStack alignItems="left" spacing="0px">
                <Text className="bold-medium">{item.title}</Text>
                <Text className="text-small">{item.description}</Text>
              </VStack>
            </HStack>
          </ListItem>
        ))}
      </UnorderedList>
    </>
  );
};
