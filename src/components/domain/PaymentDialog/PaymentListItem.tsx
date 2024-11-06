import React, { FC, useState } from 'react';
import { HStack, Icon, Link, ListItem, Spacer } from '@chakra-ui/react';
import CheckIcon from '@mui/icons-material/Check';

import { PaymentDialogPartsFragment } from '@/components/domain/PaymentDialog/PaymentDialog.fragment.generated';
import variables from '@/styles/variables.module.scss';
import { PaymentItem } from '@/components/domain/PaymentItem';
import { PaymentType } from '@/graphql/generated/types';

type Props = {
  fragment: PaymentDialogPartsFragment;
  onClick: () => void;
  onLeftSwipeDelete: (id: string) => void;
};

export const PaymentListItem: FC<Props> = ({ fragment, onClick, onLeftSwipeDelete }) => {
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);

  const isRemovable = fragment.paymentType === PaymentType.Card;

  const onTouchStart = (x: number) => {
    if (!isRemovable) return;

    setTouchEnd(0);
    setTouchStart(x);
  };
  const onTouchMove = (x: number) => {
    if (!isRemovable) return;

    setTouchEnd(x);
  };
  const onTouchEnd = () => {
    if (!isRemovable) return;

    if (touchStart == 0 || touchEnd == 0) return;
    if (touchStart - touchEnd <= 150) {
      return;
    }
    onLeftSwipeDelete(fragment.id);
  };

  return (
    <>
      <ListItem pt="16px" pb="16px" borderBottom="1px" borderColor={variables.monoBackGround}>
        <Link
          onClick={onClick}
          onTouchStart={(e) => onTouchStart(e.targetTouches[0].clientX)}
          onTouchMove={(e) => onTouchMove(e.targetTouches[0].clientX)}
          onTouchEnd={onTouchEnd}
        >
          <HStack w="full">
            <PaymentItem fragment={fragment} />
            <Spacer />
            {fragment.isSelected && <Icon as={CheckIcon} color="brand.primaryText" />}
          </HStack>
        </Link>
      </ListItem>
    </>
  );
};
