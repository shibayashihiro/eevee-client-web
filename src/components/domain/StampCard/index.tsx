import { VStack, Center, SimpleGrid, Text } from '@chakra-ui/react';

import { GiftCardIcon } from '@/components/ui/Icons/GiftCardIcon';
import { CheckIcon } from '@/components/ui/Icons/CheckIcon';

import { StampCardPartsFragment } from './StampCard.fragment.generated';

type Props = {
  stampCard: StampCardPartsFragment;
  stampColor: string;
};

export const StampCard = ({ stampCard, stampColor }: Props) => {
  const { reward, currentPoints, maxPointPerPage } = stampCard;
  return (
    <VStack spacing={0} align="stretch">
      <Center bg="brand.backgroundSoft" borderTopRadius="12px" px="34px" py="52px">
        <SimpleGrid columns={5} spacing="8px">
          {Array.from({ length: maxPointPerPage }).map((_, index) =>
            index < currentPoints ? (
              <CollectedStamp key={index} stampColor={stampColor} isLast={index === maxPointPerPage - 1} />
            ) : (
              <Stamp key={index} stampColor={stampColor} text={`${index + 1}`} isLast={index === maxPointPerPage - 1} />
            ),
          )}
        </SimpleGrid>
      </Center>
      <Reward reward={reward} collected={currentPoints >= maxPointPerPage} />
    </VStack>
  );
};

const Stamp = ({ stampColor, text, isLast }: { stampColor: string; text: string; isLast?: boolean }) => {
  return (
    <Center
      className="bold-large"
      color="mono.hint"
      bg="mono.white"
      borderRadius="50%"
      h="48px"
      w="48px"
      userSelect="none"
    >
      {isLast ? <GiftCardIcon boxSize="24px" color={stampColor} /> : text}
    </Center>
  );
};

const CollectedStamp = ({ stampColor, isLast }: { stampColor: string; isLast: boolean }) => {
  return (
    <Center bg={stampColor} h="48px" w="48px" borderRadius="50%">
      {isLast ? <GiftCardIcon boxSize="24px" color="mono.white" /> : <CheckIcon boxSize="24px" color="mono.white" />}
    </Center>
  );
};

const Reward = ({ reward, collected }: { reward: string; collected: boolean }) => {
  const text = collected ? 'スタンプカードがうまりました✨' : 'プレゼント🎁';
  return (
    <VStack
      bg={collected ? 'brand.primary' : 'mono.white'}
      color={collected ? 'mono.white' : 'mono.primary'}
      borderBottomRadius="12px"
      align="stretch"
      spacing="4px"
      px="20px"
      py="16px"
    >
      <Text className="bold-small">{text}</Text>
      <Text className="text-small">{reward}</Text>
    </VStack>
  );
};
