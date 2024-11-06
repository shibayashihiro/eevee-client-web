import { useRouter } from 'next/router';
import { Box, Center, Container, Flex, Heading, Text } from '@chakra-ui/react';
import { useState } from 'react';

import { NextPageWithLayout } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SwipeButton } from '@/components/ui/SwipeButton';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { PrimaryButton } from '@/components/ui/Button';
import { SubscriptionRouteGuard } from '@/components/domain/SubscriptionRouteGuard/SubscriptionRouteGuard';

import { BenefitForMySubscriptionPageFragment } from '../MySubscription/MySubscription.query.generated';

import {
  PlanForMySubscriptionBenefitPageFragment,
  useGetMySubscriptionBenefitPageQuery,
} from './MySubscriptionBenefit.query.generated';
import { useSubmitUseSubscriptionBenefitMutation } from './MySubscriptionBenefit.mutation.generated';

export const MySubscriptionBenefitPage: NextPageWithLayout = () => {
  const router = useRouter();

  const { benefitId } = router.query;

  const [{ data, fetching, error }] = useGetMySubscriptionBenefitPageQuery({ requestPolicy: 'network-only' });
  if (fetching) {
    return <LoadingSpinner />;
  }
  if (error) {
    throw error;
  }
  if (!data?.viewer?.subscription?.currentPlan) {
    throw new Error('not found');
  }
  const benefit = data.viewer.subscription.currentPlan.benefitUsages.find((b) => b.benefit.id === benefitId);
  if (!benefit) {
    throw new Error('not found');
  }

  return (
    <SubscriptionRouteGuard userSubscription={data.viewer.subscription}>
      <MySubscriptionBenefitPageLayout plan={data.viewer.subscription.currentPlan.plan} benefitUsage={benefit} />;
    </SubscriptionRouteGuard>
  );
};

const MySubscriptionBenefitPageLayout = ({
  plan,
  benefitUsage,
}: {
  plan: PlanForMySubscriptionBenefitPageFragment;
  benefitUsage: BenefitForMySubscriptionPageFragment;
}) => {
  const [completed, setCompleted] = useState(false);

  const [submitUseSubscriptionBenefitResult, submitUseSubscriptionBenefit] = useSubmitUseSubscriptionBenefitMutation();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const handleOnSwiped = async () => {
    const { error } = await submitUseSubscriptionBenefit({
      input: {
        benefitId: benefitUsage.benefit.id,
      },
    });
    if (error) {
      handleErrorWithAlertDialog(error);
      return;
    }
    setCompleted(true);
  };

  const { used, limit } = benefitUsage;
  const isDisabled = !limit ? false : used >= limit;

  // mutation後はそちらの結果を優先して表示
  const resultUsage = submitUseSubscriptionBenefitResult.data?.useSubscriptionBenefit.benefitUsage;
  const completedText = resultUsage?.limit ? `${resultUsage.used}/${resultUsage.limit}利用済み` : '利用済み';

  return (
    <Flex h="100vh" direction="column">
      <MyBenefitHeader plan={plan} benefitUsage={resultUsage ?? benefitUsage} />
      <Container py="32px" px="20px" alignContent="center">
        <Center flexDirection="column">
          <Text className="text-normal" textAlign="center">
            この画面をお店のスタッフに
            <br />
            提示してください。
          </Text>
          <Text mt="16px" className="text-extra-small" color="mono.secondary">
            このボタンを操作すると利用済みになってしまいます。必ずお店のスタッフと一緒に操作してください。
          </Text>
          <Box w="full" mt="12px">
            {isDisabled ? (
              <PrimaryButton isDisabled h="56px">{`${used}/${limit}利用済み`}</PrimaryButton>
            ) : (
              <SwipeButton
                mainText="サブスクを利用する"
                completedText={completedText}
                isSwiped={completed}
                onSwiped={handleOnSwiped}
                isLoading={submitUseSubscriptionBenefitResult.fetching}
              />
            )}
          </Box>
        </Center>
      </Container>
    </Flex>
  );
};

const MyBenefitHeader = ({
  plan,
  benefitUsage,
}: {
  plan: PlanForMySubscriptionBenefitPageFragment;
  benefitUsage: BenefitForMySubscriptionPageFragment;
}) => {
  const { used, limit } = benefitUsage;
  return (
    <Box
      as="header"
      position="relative"
      overflow="hidden"
      bg="brand.primary"
      py="40px"
      px="20px"
      boxShadow="0px 2px 5px 0px rgba(0, 0, 0, 0.3)"
    >
      <Heading as="h1" color="mono.white" fontSize="24px" fontWeight="600">
        {plan.title}
      </Heading>
      <Text mt="8px" className="bold-normal" color="mono.white">
        {benefitUsage.benefit.title}
      </Text>
      {limit && (
        <Text mt="8px" className="bold-extra-small" color="brand.primary" bg="mono.white" p="2px" w="fit-content">
          {`${used}/${limit}利用済み`}
        </Text>
      )}
      <DiagonalLine />
    </Box>
  );
};

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
