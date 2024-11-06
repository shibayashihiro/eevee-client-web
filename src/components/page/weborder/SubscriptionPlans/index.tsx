import { Container, Heading, VStack, Text, HStack, Image, Center, Box, Flex } from '@chakra-ui/react';
import { ReactNode, useCallback, useState } from 'react';

import { NextPageWithLayout } from '@/types';
import variables from '@/styles/variables.module.scss';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PrimaryButton } from '@/components/ui/Button';
import { FixedFooter } from '@/components/ui/FixedFooter';
import { SelectableSubscriptionPlanCard } from '@/components/domain/SubscriptionPlanCard/SelectableSubscriptionPlanCard';
import { useBottomSheet } from '@/components/ui/BottomSheetDrawer';
import { SubscriptionRegistrationProcessBottomSheet } from '@/components/domain/SubscriptionRegistrationProcessBottomSheet';
import { useAdditionalTypeNamesContext } from '@/graphql/helper';
import { Payment } from '@/graphql/generated/types';

import { GetSubscriptionPlansPageQuery, useGetSubscriptionPlansPageQuery } from './SubscriptionPlans.query.generated';

export const SubscriptionPlansPage: NextPageWithLayout = () => {
  const context = useAdditionalTypeNamesContext<[Payment]>(['Payment']); // 支払い方法が変更された際にキャッシュを更新するため指定
  const [{ data, fetching, error }] = useGetSubscriptionPlansPageQuery({ context });

  if (fetching) {
    return <LoadingSpinner />;
  }
  if (error) {
    throw error;
  }

  const subscription = data?.viewing?.subscription;
  if (!subscription) {
    throw new Error('not found');
  }

  return <SubscriptionPlansPageLayout subscription={subscription} user={data.viewer} />;
};

type querySubscriptionType = Exclude<GetSubscriptionPlansPageQuery['viewing']['subscription'], undefined | null>;
type queryPlanType = querySubscriptionType['plans'][0];
type queryUserType = GetSubscriptionPlansPageQuery['viewer'];

const SubscriptionPlansPageLayout = ({
  subscription,
  user,
}: {
  subscription: querySubscriptionType;
  user: queryUserType;
}) => {
  const [selectedPlan, setSelectedPlan] = useState<queryPlanType | null>(null);

  const planById = subscription.plans.reduce<Record<string, querySubscriptionType['plans'][0]>>((acc, plan) => {
    acc[plan.id] = plan;
    return acc;
  }, {});

  const handleClickPlan = useCallback(
    (planId: string) => {
      setSelectedPlan(planById[planId]);
    },
    [planById],
  );

  const { isOpen, onOpen, onClose } = useBottomSheet();

  return (
    <Flex h="100vh" direction="column">
      <Container maxW={variables.containerMaxWidth} p="20px" flexGrow={1}>
        <VStack spacing="40px" align="stretch">
          <VStack as="header" spacing="8px" align="start">
            <Heading as="h1" fontSize="24px" fontWeight="600">
              {subscription.title}
            </Heading>
            <Text fontSize="14px">{subscription.description}</Text>
          </VStack>
          <VStack align="stretch" spacing="24px">
            {subscription.features.map((feature, index) => (
              <SubscriptionFeature key={index} {...feature} />
            ))}
          </VStack>
          <VStack as="section" align="stretch">
            <Heading as="h2" className="bold-large" fontSize="18px">
              プラン選択
            </Heading>
            <VStack align="stretch" spacing="16px">
              {subscription.plans.map((plan) => (
                <SelectableSubscriptionPlanCard
                  key={plan.id}
                  plan={plan}
                  onClick={handleClickPlan}
                  selected={selectedPlan?.id == plan.id}
                />
              ))}
            </VStack>
          </VStack>
          <QuestionAndAnswers helpUrl={subscription.helpUrl} />
          <Contact contactUrl={subscription.contactUrl} />
        </VStack>
      </Container>
      <FixedFooter>
        <Center py="28px" px="40px">
          <PrimaryButton
            onClick={() => {
              onOpen();
            }}
            isDisabled={!selectedPlan}
          >
            {selectedPlan ? '確認画面に進む' : 'プランを選択してください'}
          </PrimaryButton>
        </Center>
      </FixedFooter>
      {selectedPlan && (
        <SubscriptionRegistrationProcessBottomSheet
          isOpen={isOpen}
          onClose={onClose}
          subscription={subscription}
          plan={selectedPlan}
          user={user}
        />
      )}
    </Flex>
  );
};

const SubscriptionFeature = ({ icon, title, description }: { icon: string; title: string; description: string }) => {
  return (
    <HStack spacing="12px" align="start">
      <Center boxSize="48px" p="10px" bg="brand.primary" borderRadius="full" display="inline-flex" flexShrink={0}>
        <Image src={icon} alt="" />
      </Center>
      <VStack align="start" spacing="2px">
        <Text className="bold-normal">{title}</Text>
        <Text>{description}</Text>
      </VStack>
    </HStack>
  );
};

const QuestionAndAnswers = ({ helpUrl }: { helpUrl: string }) => {
  return (
    <VStack as="section" align="start" spacing="16px">
      <Heading as="h2" className="bold-large" fontSize="18px">
        よくある質問
      </Heading>
      <VStack align="start" spacing="16px">
        <QuestionAndAnswerItem
          question="どのような支払い方法が選べますか？"
          answer="クレジットカードがご利用いただけます"
        />
        <QuestionAndAnswerItem question="解約に制限はありますか？" answer="いつでも解約可能です" />
        <QuestionAndAnswerItem
          question="会員特典はどうやって使えばいいですか？"
          answer={
            <Text>
              ■&nbsp;アプリ内で利用可能な場合
              <br />
              アプリからのご注文時にカート画面で選択をしていただくと特典が適用されます
              <br />
              ■&nbsp;レジで利用可能な場合
              <br />
              レジでスタッフに画面を見せて利用済みにしてください
            </Text>
          }
        />
      </VStack>
      <Center w="full">
        <PrimaryButton as="a" w="min-content" href={helpUrl} target="_blank">
          もっと見る
        </PrimaryButton>
      </Center>
    </VStack>
  );
};

const QuestionAndAnswerItem = ({ question, answer }: { question: string; answer: ReactNode }) => {
  return (
    <VStack align="start" className="text-small">
      <HStack spacing="8px" className="bold-small" align="start">
        <Text>Q:</Text>
        <Text>{question}</Text>
      </HStack>
      <HStack spacing="8px" align="start">
        <Text className="bold-small">A:</Text>
        <Box>{answer}</Box>
      </HStack>
    </VStack>
  );
};

const Contact = ({ contactUrl }: { contactUrl: string }) => {
  return (
    <VStack spacing="16px">
      <Text>そのほか、ご不明な点は下記よりお問い合わせください</Text>
      <PrimaryButton as="a" w="min-content" href={contactUrl} target="_blank">
        問い合わせる
      </PrimaryButton>
    </VStack>
  );
};
