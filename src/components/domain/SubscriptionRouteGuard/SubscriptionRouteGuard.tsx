import { useEffect, useState } from 'react';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { subscriptionPlansPage } from '@/utils/paths/tenantPages';
import { UserSubscriptionStatus } from '@/graphql/generated/types';

import { UserSubscriptionForRouteGuardFragment } from './SubscriptionRouteGuard.fragment.generated';

type Props = {
  userSubscription: UserSubscriptionForRouteGuardFragment;
  children: React.ReactNode;
};

/**
 * サブスク加入してないと表示できない画面を保護するためのコンポーネント
 */
export const SubscriptionRouteGuard = ({ userSubscription, children }: Props) => {
  const [loading, setLoading] = useState(true);
  const router = useTenantRouter();

  const { currentPlan } = userSubscription;

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    try {
      if (!currentPlan || currentPlan.status === UserSubscriptionStatus.CancelCompleted) {
        router.replace(subscriptionPlansPage);
        return;
      }
    } finally {
      setLoading(false);
    }
  }, [currentPlan, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};
