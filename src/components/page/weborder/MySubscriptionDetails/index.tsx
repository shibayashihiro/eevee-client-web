import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  LinkBox,
  LinkOverlay,
  List,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useCallback } from 'react';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { NextPageWithLayout } from '@/types';
import { dateTimeToDate } from '@/graphql/helper';
import { formatDateToYMD, formatDateToYMDHM, formatPrice } from '@/utils/formatUtils';
import { CircleNumber } from '@/components/ui/CircleNumber';
import { PaymentItem } from '@/components/domain/PaymentItem';
import { UserSubscriptionStatus } from '@/graphql/generated/types';
import { RightIcon } from '@/components/ui/Icons/RightIcon';
import { CancelIcon } from '@/components/ui/Icons/CancelIcon';
import { useSimpleToast } from '@/components/ui/toast/SimpleToast';
import { useGlobalLoadingSpinnerDispatch } from '@/providers/GlobalLoadingSpinnerProvider';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { PrimaryButton } from '@/components/ui/Button';
import { SubscriptionRouteGuard } from '@/components/domain/SubscriptionRouteGuard/SubscriptionRouteGuard';

import {
  TenantSubscriptionForMySubscriptionDetailsPageFragment,
  useGetMySubscriptionDetailsPageQuery,
  UserSubscriptionForDetailsPageFragment,
  UserSubscriptionStatusDescriptionFragment,
} from './MySubscriptionDetails.query.generated';
import { StatusBadge } from './StatusBadge';
import { ConfirmationDialog } from './ConfirmationDialog';
import { useCancelUnsubscribeMutation, useUnsubscribeMutation } from './MySubscriptionDetails.mutation.generated';

export const MySubscriptionDetailsPage: NextPageWithLayout = () => {
  const [{ data, fetching, error }] = useGetMySubscriptionDetailsPageQuery({ requestPolicy: 'network-only' });
  if (fetching) {
    return <LoadingSpinner />;
  }
  if (error) {
    throw error;
  }
  if (!data?.viewer?.subscription || !data.viewing?.subscription?.helpUrl) {
    throw new Error('not found');
  }
  return (
    <SubscriptionRouteGuard userSubscription={data.viewer.subscription}>
      <MySubscriptionDetailsPageLayout
        subscription={data.viewing.subscription}
        userSubscription={data.viewer.subscription}
      />
    </SubscriptionRouteGuard>
  );
};

const MySubscriptionDetailsPageLayout = ({
  subscription,
  userSubscription,
}: {
  subscription: TenantSubscriptionForMySubscriptionDetailsPageFragment;
  userSubscription: UserSubscriptionForDetailsPageFragment;
}) => {
  const { helpUrl, contactUrl } = subscription;
  const status = userSubscription.currentPlan.status;
  return (
    <Flex h="100vh" direction="column">
      <Container py="24px" px="20px">
        <Box as="main">
          <Heading as="h1" fontSize="24px" fontWeight="600">
            {/* TODO: 解約機能ができたら: "登録内容の確認・変更" */}
            登録内容の確認
          </Heading>
          <Box mt="22px">
            <CurrentPlanOverview subscription={userSubscription} />
          </Box>
          <Box mt="16px">
            {status !== UserSubscriptionStatus.CancelCompleted && (
              <SubscriptionEditActions subscriptionTitle={subscription.title} userSubscription={userSubscription} />
            )}
            {status === UserSubscriptionStatus.Cancelled && (
              <CancelUnsubscribeButton userSubscription={userSubscription} />
            )}
          </Box>

          <Box mt="40px">
            <PaymentHistory subscription={userSubscription} />
          </Box>
        </Box>
        <VStack as="footer" align="start" mt="40px" spacing="16px">
          <ExternalLink href={helpUrl} text="定期購入サービスについて" />
          <ExternalLink href={contactUrl} text="お問い合わせ" />
        </VStack>
      </Container>
    </Flex>
  );
};

const CurrentPlanOverview = ({ subscription }: { subscription: UserSubscriptionForDetailsPageFragment }) => {
  const { currentPlan } = subscription;
  const nextDateLabel = currentPlan.status === UserSubscriptionStatus.Cancelled ? '解約予定日' : '次回更新日';
  return (
    <VStack align="start" spacing="16px">
      <VStack align="start" spacing="10px">
        <StatusBadge plan={currentPlan} />
        {currentPlan.status === UserSubscriptionStatus.PaymentFailed && (
          <PaymentFailedDescription subscription={subscription} />
        )}
      </VStack>
      <VStack align="start" spacing="4px">
        <Text className="bold-normal">{currentPlan.plan.title}</Text>
        <Text className="bold-small">{`月額${formatPrice(currentPlan.plan.price)}`}</Text>
      </VStack>
      <List spacing="8px">
        {currentPlan.plan.benefits.map((benefit, index) => (
          <BenefitListItem key={index} index={index} title={benefit.title} />
        ))}
      </List>
      <HStack spacing="8px">
        <PaymentItem fragment={subscription.payment} />
      </HStack>
      <VStack align="start" spacing={0}>
        <Text>{`登録日時: ${formatDateToYMDHM(dateTimeToDate(subscription.currentPlan.startedAt))}`}</Text>
        <Text>{`${nextDateLabel}: ${formatDateToYMDHM(dateTimeToDate(subscription.currentPlan.expiresAt))}`}</Text>
      </VStack>
    </VStack>
  );
};

const PaymentFailedDescription = ({ subscription }: { subscription: UserSubscriptionStatusDescriptionFragment }) => {
  const {
    payment: { brand, last4 },
  } = subscription;

  const paymentName = `[${brand}] **** ${last4}`;

  return (
    <Text
      className="text-extra-small"
      align="center"
      p="8px"
      borderRadius="4px"
      bg="mono.backGround"
    >{`支払い方法に設定されている ${paymentName} のお支払いに問題が発生しました。一度解約し、再度登録の手続きをお願いいたします。`}</Text>
  );
};

// 色々なページでBenefitListItemを作成しているが、各ページで本当に同じものとして良いかまだ確信がないため、
// 今後同じ理由で複数のBenefitListItemを変更する時があれば、Fragmentを利用した共通化を検討する
const BenefitListItem = ({ index, title }: { index: number; title: string }) => (
  <HStack as="li" spacing="6px">
    <CircleNumber number={index + 1} bgColor="mono.primary" textColor="mono.white" />
    <Text fontWeight="600">{title}</Text>
  </HStack>
);

const SubscriptionEditActions = ({
  subscriptionTitle,
  userSubscription,
}: {
  subscriptionTitle: string;
  userSubscription: UserSubscriptionForDetailsPageFragment;
}) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const status = userSubscription.currentPlan.status;
  const showUnsubscribe = status !== UserSubscriptionStatus.Cancelled;
  return (
    <>
      <VStack spacing="8px" align="end">
        {showUnsubscribe && (
          <IconTextButton
            icon={<CancelIcon color="brand.primaryText" boxSize="16px" />}
            text="解約する"
            onClick={onOpen}
          />
        )}
      </VStack>
      {showUnsubscribe && (
        <UnsubscribeConfirmationDialog
          isOpen={isOpen}
          onClose={onClose}
          subscriptionTitle={subscriptionTitle}
          userSubscription={userSubscription}
        />
      )}
    </>
  );
};

const UnsubscribeConfirmationDialog = ({
  isOpen,
  onClose,
  subscriptionTitle,
  userSubscription,
}: {
  isOpen: boolean;
  onClose: () => void;
  subscriptionTitle: string;
  userSubscription: UserSubscriptionForDetailsPageFragment;
}) => {
  const showToast = useSimpleToast();
  const setLoading = useGlobalLoadingSpinnerDispatch();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const [_, submitUnsubscribe] = useUnsubscribeMutation();

  const handleClickConfirm = useCallback(async () => {
    setLoading(true);
    try {
      const { error } = await submitUnsubscribe({
        input: {},
      });
      if (error) {
        handleErrorWithAlertDialog(error);
        return;
      }
    } finally {
      setLoading(false);
    }
    showToast('解約しました');
    onClose();
  }, [setLoading, showToast, onClose, submitUnsubscribe, handleErrorWithAlertDialog]);

  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      title={`${subscriptionTitle}の解約`}
      onConfirm={handleClickConfirm}
    >
      解約すると、{formatDateToYMD(dateTimeToDate(userSubscription.currentPlan.expiresAt))}
      まで引き続き登録中のプランをご利用いただけます。プラン変更は自動的にキャンセルされます。解約してよろしいですか？
    </ConfirmationDialog>
  );
};

const IconTextButton = ({ icon, text, onClick }: { icon: React.ReactElement; text: string; onClick: () => void }) => {
  return (
    <Button
      leftIcon={icon}
      iconSpacing="4px"
      color="brand.primaryText"
      alignItems="center"
      variant="unstyled"
      display="flex"
      onClick={onClick}
      h="min-content"
    >
      <Text className="text-extra-small" fontWeight="normal">
        {text}
      </Text>
    </Button>
  );
};

const CancelUnsubscribeButton = ({
  userSubscription,
}: {
  userSubscription: UserSubscriptionForDetailsPageFragment;
}) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  return (
    <>
      <PrimaryButton h="56px" w="full" onClick={onOpen}>
        解約をキャンセルする
      </PrimaryButton>
      <CancelUnsubscribeConfirmationDialog isOpen={isOpen} onClose={onClose} userSubscription={userSubscription} />
    </>
  );
};

const CancelUnsubscribeConfirmationDialog = ({
  isOpen,
  onClose,
  userSubscription,
}: {
  isOpen: boolean;
  onClose: () => void;
  userSubscription: UserSubscriptionForDetailsPageFragment;
}) => {
  const showToast = useSimpleToast();
  const setLoading = useGlobalLoadingSpinnerDispatch();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const [_, submitCancelUnsubscribe] = useCancelUnsubscribeMutation();

  const handleClickConfirm = useCallback(async () => {
    setLoading(true);
    try {
      const { error } = await submitCancelUnsubscribe({
        input: {},
      });
      if (error) {
        handleErrorWithAlertDialog(error);
        return;
      }
    } finally {
      setLoading(false);
    }
    showToast('解約をキャンセルしました');
    onClose();
  }, [setLoading, showToast, onClose, submitCancelUnsubscribe, handleErrorWithAlertDialog]);

  return (
    <ConfirmationDialog isOpen={isOpen} onClose={onClose} title="解約キャンセル" onConfirm={handleClickConfirm}>
      {formatDateToYMD(dateTimeToDate(userSubscription.currentPlan.expiresAt))}
      以降も引き続き登録中のプランをご利用いただけるようになります。解約をキャンセルしてよろしいですか？
    </ConfirmationDialog>
  );
};

const PaymentHistory = ({ subscription }: { subscription: UserSubscriptionForDetailsPageFragment }) => {
  const { paymentHistories } = subscription;
  return (
    <VStack align="start" spacing="8px">
      <Heading as="h2" fontSize="18px" fontWeight="700" color="mono.secondary">
        支払い履歴
      </Heading>
      <List spacing="0px" w="full">
        {paymentHistories.map((history, index) => (
          <Box
            key={index}
            as="li"
            borderTopWidth="0.5px"
            borderBottomWidth={index === paymentHistories.length - 1 ? '0.5px' : '0px'}
            borderColor="rgba(221, 221, 221, 1)"
            py="18px"
            px="1px"
          >
            <Flex alignItems="center">
              <Text className="bold-small" mr="16px">
                {formatDateToYMD(dateTimeToDate(history.paidAt))}
              </Text>
              <Text className="text-small" flex="1" mr="4px">
                {history.planTitle}
              </Text>
              <Text className="text-small" textAlign="right">
                {formatPrice(history.amount)}
              </Text>
            </Flex>
            {/* TODO: 領収書の実装 */}
          </Box>
        ))}
      </List>
    </VStack>
  );
};

const ExternalLink = ({ href, text }: { href: string; text: string }) => {
  return (
    <LinkBox w="fit-content">
      <HStack>
        <Text className="text-small" color="brand.primaryText">
          <LinkOverlay href={href} isExternal>
            {text}
          </LinkOverlay>
        </Text>
        <Icon as={RightIcon} w="16px" h="16px" color="brand.primaryText" />
      </HStack>
    </LinkBox>
  );
};
