import React, { FC } from 'react';
import { Box, OrderedList } from '@chakra-ui/react';

import { HomeInProgressOrderSectionPartsFragment } from '@/components/domain/HomeInProgressOrderSection/HomeInProgressOrderSection.fragment.generated';
import { ModalDialog } from '@/components/ui/ModalDialog';
import { SingleInProgressOrderSection } from '@/components/domain/HomeInProgressOrderSection/SingleInProgressOrderSection';
import { getOrderType, isDeliveryOrder, isEatInOrder, isTakeoutOrder } from '@/graphql/helper';
import variables from '@/styles/variables.module.scss';

type Props = {
  fragment: HomeInProgressOrderSectionPartsFragment;
  isOpen: boolean;
  onClose: () => void;
};

export const ListInProgressOrderDialog: FC<Props> = ({ fragment, isOpen, onClose }: Props) => {
  return (
    <ModalDialog
      title="注文一覧"
      isOpen={isOpen}
      onClose={onClose}
      secondaryAction={{
        text: '閉じる',
        onClick: onClose,
      }}
    >
      <OrderedList styleType="none" marginStart="0px">
        {fragment.orders.map((order, i) => (
          <Box key={i} borderBottom="1px" borderColor={variables.monoBackGround}>
            {(isDeliveryOrder(order) || isEatInOrder(order) || isTakeoutOrder(order)) && order.progress && (
              <SingleInProgressOrderSection
                id={order.id}
                shortIds={order.shortIds}
                stepSubject={order.progress.stepSubject}
                scheduledTime={order.progress.scheduledTime}
                orderType={getOrderType(order)}
              />
            )}
          </Box>
        ))}
      </OrderedList>
    </ModalDialog>
  );
};
