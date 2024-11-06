import { Box, Container, Flex, Heading, HStack, List, Text, VStack } from '@chakra-ui/react';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { NextPageWithLayout } from '@/types';
import { CircleNumber } from '@/components/ui/CircleNumber';
import { PrimaryButton } from '@/components/ui/Button';
import { FixedFooter } from '@/components/ui/FixedFooter';
import { mySubscriptionBenefitPage, mySubscriptionDetailsPage } from '@/utils/paths/tenantPages';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';

import {
  BenefitForMySubscriptionPageFragment,
  useGetMySubscriptionPageQuery,
  UserSubscriptionPlanForMySubscriptionPageFragment,
} from './MySubscription.query.generated';

export const MySubscriptionPage: NextPageWithLayout = () => {
  const [{ data, fetching, error }] = useGetMySubscriptionPageQuery({ requestPolicy: 'network-only' });
  if (fetching) {
    return <LoadingSpinner />;
  }
  if (error) {
    throw error;
  }
  if (!data?.viewing.subscription || !data?.viewer?.subscription?.currentPlan) {
    throw new Error('not found');
  }
  return (
    <MySubscriptionPageLayout
      subscriptionTitle={data.viewing.subscription.title}
      userSubscriptionPlan={data.viewer.subscription.currentPlan}
      userName={data.viewer.profile?.displayName}
    />
  );
};

const MySubscriptionPageLayout = ({
  subscriptionTitle,
  userSubscriptionPlan,
  userName,
}: {
  subscriptionTitle: string;
  userSubscriptionPlan: UserSubscriptionPlanForMySubscriptionPageFragment;
  userName: string | undefined;
}) => {
  const router = useTenantRouter();
  const { plan } = userSubscriptionPlan;
  return (
    <Flex h="100vh" direction="column">
      <Container flexGrow={1} p="20px">
        <Heading as="h1" fontSize="24px">
          {plan.title}
        </Heading>
        <Box mt="8px">
          <UserInfo
            subscriptionTitle={subscriptionTitle}
            userSubscriptionPlan={userSubscriptionPlan}
            userName={userName}
          />
        </Box>
        <List mt="24px" spacing="16px">
          {userSubscriptionPlan.benefitUsages.map((benefit, index) => (
            <BenefitListItem key={index} index={index} benefit={benefit} />
          ))}
        </List>
      </Container>
      <FixedFooter>
        <Box py="28px" px="20px">
          <PrimaryButton
            as="a"
            h="56px"
            onClick={() => {
              router.push(mySubscriptionDetailsPage);
            }}
          >
            登録内容を確認・変更する
          </PrimaryButton>
        </Box>
      </FixedFooter>
    </Flex>
  );
};

const UserInfo = ({
  subscriptionTitle,
  userSubscriptionPlan,
  userName,
}: {
  subscriptionTitle: string;
  userSubscriptionPlan: UserSubscriptionPlanForMySubscriptionPageFragment;
  userName: string | undefined;
}) => {
  return (
    <VStack align="start" spacing={0}>
      {userName && (
        <Text className="bold-small" color="brand.primaryText">
          {userName}さん
        </Text>
      )}
      <Text
        className="bold-micro"
        color="brand.primaryText"
        bg="brand.backgroundSoft"
        width="fit-content"
      >{`${subscriptionTitle}${userSubscriptionPlan.subscriptionMonth}ヶ月目`}</Text>
    </VStack>
  );
};

const BenefitListItem = ({ index, benefit }: { index: number; benefit: BenefitForMySubscriptionPageFragment }) => {
  const { used, limit } = benefit;
  const disabled = !limit ? false : used >= limit;
  const router = useTenantRouter();
  return (
    <Flex
      as="li"
      direction="column"
      py="16px"
      px="12px"
      borderRadius="12px"
      boxShadow="0px 0px 12.2px 0px rgba(0, 0, 0, 0.1), 0px 2px 5px 0px rgba(0, 0, 0, 0.05)"
    >
      <HStack spacing="8px" align="start">
        <CircleNumber number={index + 1} bgColor="mono.primary" textColor="mono.white" />
        <VStack align="start" spacing="4px">
          <Text className="bold-normal">{benefit.benefit.title}</Text>
          {limit && (
            <Text className="bold-extra-small" bgColor="mono.primary" color="mono.white" p="2px" w="fit-content">
              {`${used}/${limit}利用済み`}
            </Text>
          )}
        </VStack>
      </HStack>
      {/* TODO: スワイプ利用Benefitの時だけボタンを表示する */}
      <PrimaryButton
        as="a"
        mt="12px"
        py="12px"
        h="fit-content"
        isDisabled={disabled}
        onClick={() => {
          if (disabled) {
            return;
          }
          router.push(mySubscriptionBenefitPage(benefit.benefit.id));
        }}
      >
        利用する
      </PrimaryButton>
    </Flex>
  );
};
