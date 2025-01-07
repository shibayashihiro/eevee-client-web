import { Flex, VStack, Text, Button, useDisclosure } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { PhoneIcon } from '@/components/ui/Icons/PhoneIcon';
import { PhoneCallConfirmDialog } from '@/components/domain/PhoneCallConfirmDialog';
import { toFullAddress } from '@/utils/formatUtils';

import { InProgressOrderStatusViewDeliveryFragment } from './InProgressOrderStatusViewDelivery.fragment.generated';

type Props = {
  order: InProgressOrderStatusViewDeliveryFragment;
};

export const InProgressOrderStatusViewDelivery = ({ order }: Props) => {
  if (!order.progress) {
    return null;
  }
  return (
    <VStack align="stretch" spacing="24px">
      <ShippingInfo scheduledTime={order.progress.scheduledTime} />
      <Text textStyle="bold-large">お届けまでお待ちください</Text>
      <Flex justify="flex-end">
        <ContactButton phoneNumber={order.facility.phoneNumber} />
      </Flex>
      <Text fontSize="24px" fontWeight="bold" lineHeight="33.6px">
        {order.facility.shortName}
      </Text>
      <DeliveryAddress order={order} />
      <ReceiveNumber shortIds={order.shortIds} />
    </VStack>
  );
};

const ShippingInfo = ({ scheduledTime }: { scheduledTime: string }) => {
  return (
    <VStack align="start" spacing="16px">
      <InfoItem title="お届け時間の目安">
        <Text as="span" fontSize="32px" fontWeight="bold" lineHeight="30px" letterSpacing="-0.24px">
          {scheduledTime}
        </Text>
        <Text as="span" ml="3px" textStyle="bold-small">
          までにお届け予定です
        </Text>
      </InfoItem>
    </VStack>
  );
};

const ContactButton = ({ phoneNumber }: { phoneNumber: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button display="flex" flexDirection="row" gap="4px" variant="link" textDecoration="none" onClick={onOpen}>
        <PhoneIcon boxSize="16px" />
        <Text as="span">注文について店舗に問い合わせる</Text>
      </Button>
      <PhoneCallConfirmDialog
        isOpen={isOpen}
        onClose={onClose}
        title="注文について店舗に問い合わせる"
        tel={phoneNumber}
      />
    </>
  );
};

const DeliveryAddress = ({ order }: { order: InProgressOrderStatusViewDeliveryFragment }) => {
  return (
    <InfoItem title="お届け先">
      <VStack align="start" spacing="4px">
        <Text textStyle="bold-small">
          {toFullAddress(
            order.deliveryAddress.prefecture,
            order.deliveryAddress.addressLine,
            order.deliveryAddress.buildingName,
            order.deliveryAddress.roomNumber,
          )}
        </Text>
        {order.noContactDeliveryOption?.requestNoContactDelivery && (
          <Text textStyle="text-extra-small">玄関前に置き配でお願いします</Text>
        )}
      </VStack>
    </InfoItem>
  );
};

const ReceiveNumber = ({ shortIds }: { shortIds: string[] }) => {
  return (
    <InfoItem title="お届け番号">
      <Text textStyle="bold-small">{shortIds.join(', ')}</Text>
    </InfoItem>
  );
};

const InfoItem = ({ title, children }: { title: string; children: ReactNode }) => {
  return (
    <VStack as="dl" align="start" spacing="4px">
      <Text as="dt" textStyle="bold-extra-small" color="mono.secondary">
        {title}
      </Text>
      <dd>{children}</dd>
    </VStack>
  );
};
