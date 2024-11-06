import { Box } from '@chakra-ui/react';

import { DateTime, UserSubscriptionStatus } from '@/graphql/generated/types';
import { dateTimeToDate } from '@/graphql/helper';
import { formatDateToMDslash } from '@/utils/formatUtils';

import { UserSubscriptionStatusBadgeFragment } from './StatusBadge.fragment.generated';

type Props = {
  plan: UserSubscriptionStatusBadgeFragment;
};

const colors: Record<UserSubscriptionStatus, string> = {
  [UserSubscriptionStatus.Active]: 'brand.primary',
  [UserSubscriptionStatus.Cancelled]: 'mono.secondary',
  [UserSubscriptionStatus.CancelCompleted]: 'mono.secondary',
  [UserSubscriptionStatus.PaymentFailed]: 'mono.primary',
};
export const StatusBadge = ({ plan }: Props) => {
  const label = statusLabel(plan.status, plan.expiresAt);
  const color = colors[plan.status];

  return (
    <Box className="bold-small" py="2px" px="4px" bg={color} color="white" borderRadius="2px">
      {label}
    </Box>
  );
};

const statusLabel = (status: UserSubscriptionStatus, expiresAt: DateTime) => {
  switch (status) {
    case UserSubscriptionStatus.Active:
      return '登録中';
    case UserSubscriptionStatus.Cancelled:
      const d = dateTimeToDate(expiresAt);
      return `解約済み (${formatDateToMDslash(d)}まで利用可能)`;
    case UserSubscriptionStatus.CancelCompleted:
      return `解約済み`;
    case UserSubscriptionStatus.PaymentFailed:
      return '支払いエラー';
  }
};
