import { useEffect } from 'react';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { NextPageWithLayout } from '@/types';
import { mySubscriptionDetailsPage, mySubscriptionPage, subscriptionPlansPage } from '@/utils/paths/tenantPages';
import { UserSubscriptionStatus } from '@/graphql/generated/types';

import { GetSubscriptionHomeQuery, useGetSubscriptionHomeQuery } from './SubscriptionHome.query.generated';

/**
 * Statusを見て適切なサブスクページに遷移するだけのページ
 */
export const SubscriptionHomePage: NextPageWithLayout = () => {
  const [{ data, fetching, error }] = useGetSubscriptionHomeQuery({ requestPolicy: 'network-only' });

  if (fetching) {
    return <LoadingSpinner />;
  }
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error('not found');
  }

  return <SubscriptionPageController viewer={data.viewer} />;
};

const getMoveToPage = (status: UserSubscriptionStatus) => {
  switch (status) {
    case UserSubscriptionStatus.Active:
    case UserSubscriptionStatus.Cancelled: // 解約済みでも有効期限内はサブスクを使える
      return mySubscriptionPage;
    case UserSubscriptionStatus.PaymentFailed: // 支払いエラーの場合は内容確認画面へ
      return mySubscriptionDetailsPage;
    case UserSubscriptionStatus.CancelCompleted: // 解約完了なので新規登録画面へ
      return subscriptionPlansPage;
  }
};

const SubscriptionPageController = ({ viewer }: { viewer: GetSubscriptionHomeQuery['viewer'] }) => {
  const router = useTenantRouter();

  const currentPlan = viewer.subscription?.currentPlan;

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (currentPlan) {
      router.replace(getMoveToPage(currentPlan.status));
      return;
    }
    router.replace(subscriptionPlansPage); // プラン選択(新規登録)画面へ
  }, [currentPlan, router]);

  return <LoadingSpinner />;
};
