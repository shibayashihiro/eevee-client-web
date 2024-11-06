import { FC } from 'react';

import { HomeInProgressOrderSectionPartsFragment } from '@/components/domain/HomeInProgressOrderSection/HomeInProgressOrderSection.fragment.generated';
import { SingleInProgressOrderSection } from '@/components/domain/HomeInProgressOrderSection/SingleInProgressOrderSection';
import { getOrderType, isDeliveryOrder, isEatInOrder, isTakeoutOrder } from '@/graphql/helper';
import { MultipleInProgressOrderSection } from '@/components/domain/HomeInProgressOrderSection/MultipleInProgressOrdersSection';

type Props = {
  fragment: HomeInProgressOrderSectionPartsFragment;
};

export const HomeInProgressOrderSection: FC<Props> = ({ fragment }: Props) => {
  if (!fragment.orders) {
    return null;
  }
  const order = fragment.orders[0];
  return (
    <>
      {fragment.orders.length == 1 && (isDeliveryOrder(order) || isEatInOrder(order) || isTakeoutOrder(order)) && (
        <SingleInProgressOrderSection
          id={order.id}
          shortIds={order.shortIds}
          stepSubject={order.progress?.stepSubject ?? ''}
          scheduledTime={order.progress?.scheduledTime ?? ''}
          enclose={true}
          orderType={getOrderType(order)}
        />
      )}
      {fragment.orders.length > 1 && <MultipleInProgressOrderSection fragment={fragment} />}
    </>
  );
};
