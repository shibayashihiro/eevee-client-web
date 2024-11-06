import { Box, Heading, VStack, Text, List, HStack } from '@chakra-ui/react';
import { useState } from 'react';

import { SecondaryButton } from '@/components/ui/Button';
import { CircleNumber } from '@/components/ui/CircleNumber';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { subscriptionHomePage } from '@/utils/paths/tenantPages';

import { UserSubscriptionPlanForRegistrationCompletedFragment } from './SubscriptionRegistrationCompleted.fragment.generated';

type Props = {
  subscriptionTitle: string;
  completedPlan: UserSubscriptionPlanForRegistrationCompletedFragment;
  userName: string | undefined;
};

export const SubscriptionRegistrationCompleted = ({ subscriptionTitle, completedPlan, userName }: Props) => {
  const router = useTenantRouter();
  const [loading, setLoading] = useState(false);

  const handleClickClose = async () => {
    setLoading(true);
    await router.replace(subscriptionHomePage);
  };

  return (
    <Box as="section">
      <Heading as="h2" fontSize="18px" fontWeight="600" textAlign="center">
        登録が完了しました 🎉
      </Heading>
      <Box mt="16px">
        <SubscriptionPlanCard subscriptionTitle={subscriptionTitle} completedPlan={completedPlan} userName={userName} />
      </Box>
      <SecondaryButton mt="24px" isLoading={loading} onClick={handleClickClose}>
        閉じる
      </SecondaryButton>
    </Box>
  );
};

const SubscriptionPlanCard = ({
  subscriptionTitle,
  completedPlan,
  userName,
}: {
  subscriptionTitle: string;
  completedPlan: UserSubscriptionPlanForRegistrationCompletedFragment;
  userName: string | undefined;
}) => {
  const { plan } = completedPlan;
  return (
    <VStack
      position="relative"
      cursor="pointer"
      align="start"
      w="full"
      py="24px"
      px="20px"
      borderRadius="12px"
      spacing="20px"
      color="mono.white"
      bg="brand.primary"
      boxShadow="0px 2px 5px 0px rgba(0, 0, 0, 0.3)"
      overflow="hidden"
    >
      <Text fontSize="20px" fontWeight="600">
        {plan.title}
      </Text>
      <List spacing="14px">
        {plan.benefits.map((benefit, index) => (
          <BenefitListItem key={index} index={index} title={benefit.title} />
        ))}
      </List>
      <VStack align="start" spacing={0}>
        {userName && <Text className="bold-small">{userName}さん</Text>}
        <Text className="bold-micro" bg="white" color="brand.primaryText" py="1px" px="2px">
          {`${subscriptionTitle}${completedPlan.subscriptionMonth}ヶ月目`}
        </Text>
      </VStack>
      <DiagonalLine />
    </VStack>
  );
};

const BenefitListItem = ({ index, title }: { index: number; title: string }) => {
  return (
    <HStack as="li" spacing="6px" align="start">
      <CircleNumber number={index + 1} bgColor="mono.white" textColor="brand.primary" />
      <Text fontWeight="600">{title}</Text>
    </HStack>
  );
};

//
const DiagonalLine = () => (
  <Box
    position="absolute"
    bottom="0"
    right="0"
    w="120px"
    h="11.66px"
    marginRight="-30px"
    bgColor="mono.white"
    transform="rotate(-45deg)"
  />
);
