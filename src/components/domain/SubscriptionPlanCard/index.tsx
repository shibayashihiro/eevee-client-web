import { VStack, Text, List, Center, HStack } from '@chakra-ui/react';

import { formatPrice } from '@/utils/formatUtils';
import { CircleNumber } from '@/components/ui/CircleNumber';

import { SubscriptionPlanCardFragment } from './SubscriptionPlanCard.fragment.generated';

type Props = {
  plan: SubscriptionPlanCardFragment;
  variant?: Variant;
};

type Variant = 'default' | 'reverse';

type Style = {
  textColor: string;
  bgColor: string;
  commentTextColor: string;
  commentBgColor: string;
};

const styles: Record<Variant, Style> = {
  default: {
    textColor: 'brand.primaryText',
    bgColor: 'mono.white',
    commentTextColor: 'mono.white',
    commentBgColor: 'brand.primary',
  },
  reverse: {
    textColor: 'mono.white',
    bgColor: 'brand.primary',
    commentTextColor: 'brand.primary',
    commentBgColor: 'mono.white',
  },
};

export const SubscriptionPlanCard = ({ plan, variant = 'default' }: Props) => {
  const style = styles[variant];
  return (
    <VStack
      cursor="pointer"
      align="start"
      w="full"
      p="20px"
      borderRadius="12px"
      borderWidth="4px"
      borderColor="brand.primary"
      spacing="12px"
      color={style.textColor}
      bg={style.bgColor}
    >
      <Text fontSize="20px" fontWeight="600">
        {plan.title}
      </Text>
      <List spacing="8px">
        {plan.benefits.map((benefit, index) => (
          <BenefitListItem key={index} index={index} title={benefit.title} variant={variant} />
        ))}
      </List>
      <Text className="bold-normal"> {`月額 ${formatPrice(plan.price)}`}</Text>
      {plan.recommendedComment && (
        <Center
          className="bold-extra-small"
          color={style.commentTextColor}
          bg={style.commentBgColor}
          borderRadius="18px"
          w="full"
          py="4px"
          px="12px"
        >
          {plan.recommendedComment}
        </Center>
      )}
    </VStack>
  );
};

const BenefitListItem = ({ index, title, variant }: { index: number; title: string; variant: Variant }) => {
  const style = styles[variant];
  return (
    <HStack as="li" spacing="6px">
      <CircleNumber number={index + 1} bgColor={style.textColor} textColor={style.bgColor} />
      <Text fontWeight="600">{title}</Text>
    </HStack>
  );
};
