import { Box, Button, Center, Heading, HStack, List, Text, useDisclosure, VStack } from '@chakra-ui/react';

import { CircleNumber } from '@/components/ui/CircleNumber';
import { formatPrice } from '@/utils/formatUtils';
import { WrappedLink } from '@/components/ui/WrappedLink';
import { privacyPage } from '@/utils/paths/tenantPages';
import { PrimaryButton } from '@/components/ui/Button';

import { PaymentDialog } from '../PaymentDialog';
import { PaymentItem } from '../PaymentItem';
import { TenantPageLink } from '../TenantPageLink';

import {
  SubscriptionForRegistrationProcessFragment,
  SubscriptionPlanForRegistrationProcessFragment,
  UserForSubscriptionPlanRegistrationProcessFragment,
} from './SubscriptionRegistrationProcess.fragment.generated';
import { useSubscriptionRegistrationProcessContext } from './Provider';

type Props = {
  subscription: SubscriptionForRegistrationProcessFragment;
  plan: SubscriptionPlanForRegistrationProcessFragment;
  user: UserForSubscriptionPlanRegistrationProcessFragment;
};

export const SubscriptionRegistration = ({ subscription, plan, user }: Props) => {
  const { submitting, submitSubscribe } = useSubscriptionRegistrationProcessContext();

  const selectedPaymentMethod = user.payments.find((p) => p.isSelected);
  const handleClickSubmit = async () => {
    if (!selectedPaymentMethod) {
      return;
    }
    await submitSubscribe(plan.id);
  };

  return (
    <Box as="section">
      <Heading as="h2" fontSize="24px" fontWeight="600">
        {plan.title}
      </Heading>
      <List mt="16px" spacing="20px">
        {plan.benefits.map((benefit, index) => (
          <BenefitListItem key={index} index={index} title={benefit.title} />
        ))}
      </List>
      <Text mt="32px" className="bold-normal">{`月額 ${formatPrice(plan.price)}`}</Text>
      <Box mt="12px">
        <SubscriptionPeriodDescription subscriptionAvailableDays={subscription.availableDays} />
      </Box>
      <Box mt="32px">
        <PaymentMethod user={user} />
      </Box>
      <Box mt="24px">
        <Notice subscription={subscription} />
      </Box>
      <PrimaryButton mt="40px" isDisabled={!selectedPaymentMethod} isLoading={submitting} onClick={handleClickSubmit}>
        {plan.title}に登録する
      </PrimaryButton>
    </Box>
  );
};

const BenefitListItem = ({ index, title }: { index: number; title: string }) => (
  <HStack as="li" spacing="6px">
    <CircleNumber number={index + 1} bgColor="mono.primary" textColor="mono.white" />
    <Text fontWeight="600">{title}</Text>
  </HStack>
);

const SubscriptionPeriodDescription = ({ subscriptionAvailableDays }: { subscriptionAvailableDays: number }) => {
  const today = new Date();
  const nextUpdateDate = new Date(today);
  nextUpdateDate.setDate(nextUpdateDate.getDate() + subscriptionAvailableDays);
  return (
    <Center bg="mono.backGround" p="8px" className="text-extra-small">
      本日加入した場合は、翌月{nextUpdateDate.getDate()}
      日に自動更新されます。プラン変更・解約はマイページよりお手続き可能です。
    </Center>
  );
};

const PaymentMethod = ({ user }: { user: UserForSubscriptionPlanRegistrationProcessFragment }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const selectedPaymentMethod = user.payments.find((p) => p.isSelected);
  return (
    <>
      <VStack as="section" align="stretch">
        <Heading as="h3" fontSize="12px" fontWeight="700" color="mono.secondary">
          支払い方法
        </Heading>
        <HStack
          py="15px"
          justifyContent="space-between"
          boxShadow="0px 0.5px 0px 0px rgba(221, 221, 221, 1), 0px -0.5px 0px 0px rgba(221, 221, 221, 1)"
        >
          {selectedPaymentMethod ? (
            <PaymentItem fragment={selectedPaymentMethod} />
          ) : (
            <Text className="bold-small">未設定</Text>
          )}
          <Button
            variant="link"
            fontSize="12px"
            fontWeight="400"
            color="rgba(51, 51, 51, 1)"
            textDecoration="none"
            onClick={onOpen}
          >
            変更する
          </Button>
        </HStack>
      </VStack>
      <PaymentDialog isOpen={isOpen} onClose={onClose} fragment={user.payments} />
    </>
  );
};

const Notice = ({ subscription }: { subscription: SubscriptionForRegistrationProcessFragment }) => {
  const { title, availableDays, specialAgreementUrl, termsOfUseUrl } = subscription;
  return (
    <Text className="text-extra-small">
      {title}は1ヶ月単位({availableDays}
      日間)の定期購読サービスです。次回更新日時の前まで解約できます。解約しない場合、自動的に継続更新されます。
      <br />
      <InnerTextLink href={termsOfUseUrl} text="サービス利用規約" isExternal />、
      <InnerTextLink href={privacyPage} text="プライバシーポリシー" />、
      <InnerTextLink href={specialAgreementUrl} text="サブスク特約" isExternal />
      に同意のうえ、登録するボタンを押してください
    </Text>
  );
};

const InnerTextLink = ({ href, text, isExternal }: { href: string; text: string; isExternal?: boolean }) => {
  if (isExternal) {
    return (
      <WrappedLink href={href} isExternal color="brand.primaryText">
        {text}
      </WrappedLink>
    );
  }
  return (
    <TenantPageLink color="brand.primaryText" href={href} target="_blank">
      {text}
    </TenantPageLink>
  );
};
