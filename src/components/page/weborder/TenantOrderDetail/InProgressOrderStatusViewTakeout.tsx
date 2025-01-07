import { Flex, VStack, Text, Button, useDisclosure } from '@chakra-ui/react';

import { PhoneIcon } from '@/components/ui/Icons/PhoneIcon';
import { LatLng } from '@/graphql/generated/types';
import { FacilityLocationMap } from '@/components/domain/FacilityLocationMap';
import { LocationIcon } from '@/components/ui/Icons/LocationIcon';
import { OrderReceivedConfirmDialog } from '@/components/domain/OrderReceivedConfirmDialog';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useGlobalLoadingSpinnerDispatch } from '@/providers/GlobalLoadingSpinnerProvider';
import { PhoneCallConfirmDialog } from '@/components/domain/PhoneCallConfirmDialog';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { myPageOrderCompleted } from '@/utils/paths/tenantPages';

import { InProgressOrderStatusViewTakeoutFragment } from './InProgressOrderStatusViewTakeout.fragment.generated';
import { useReceiveTakeoutOrderFromTenantOrderDetailMutation } from './InProgressOrderStatusViewTakeout.mutation.generated';

type Props = {
  order: InProgressOrderStatusViewTakeoutFragment;
};

export const InProgressOrderStatusViewTakeout = ({ order }: Props) => {
  if (!order.progress) {
    return null;
  }
  return (
    <VStack align="stretch" spacing="24px">
      <PickupInfo scheduledTime={order.progress.scheduledTime} receiveNumber={order.shortIds.join(', ')} />
      <WaitingMessage />
      {order.progress.prepared && <ConfirmReceiptButton orderId={order.id} />}
      <Flex justify="flex-end">
        <ContactButton phoneNumber={order.facility.phoneNumber} />
      </Flex>
      <ShopInfo
        shopName={order.facility.name}
        shopShortName={order.facility.shortName}
        latLng={order.facility.latLng}
      />
    </VStack>
  );
};

const PickupInfo = ({ scheduledTime, receiveNumber }: { scheduledTime: string; receiveNumber: string }) => {
  return (
    <VStack align="start" spacing="16px">
      <PickupInfoItem title="受け取り時間" value={scheduledTime} />
      <PickupInfoItem title="受け取り番号" value={receiveNumber} />
    </VStack>
  );
};

const PickupInfoItem = ({ title, value }: { title: string; value: string }) => {
  return (
    <VStack as="dl" align="start" spacing="4px">
      <Text as="dt" textStyle="bold-extra-small" color="mono.secondary">
        {title}
      </Text>
      <Text as="dd" fontSize="32px" fontWeight="bold" lineHeight="30px" letterSpacing="-0.24px">
        {value}
      </Text>
    </VStack>
  );
};

const WaitingMessage = () => {
  return (
    <VStack align="start" spacing="8px">
      <Text textStyle="bold-large">お時間になったらお越しください</Text>
      <Text textStyle="text-extra-small" color="mono.secondary">
        ※受け取り時間から30分経過した場合は廃棄いたします
      </Text>
    </VStack>
  );
};

const ConfirmReceiptButton = ({ orderId }: { orderId: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [_, submitReceive] = useReceiveTakeoutOrderFromTenantOrderDetailMutation();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();
  const setLoading = useGlobalLoadingSpinnerDispatch();

  const router = useTenantRouter();

  const handleClickConfirm = async () => {
    setLoading(true);
    const { error } = await submitReceive({
      input: {
        orderId,
      },
    });
    setLoading(false);
    if (error) {
      handleErrorWithAlertDialog(error);
      onClose();
      return;
    }
    router.push(myPageOrderCompleted(orderId));
  };

  return (
    <>
      <Button variant="primary" h="56px" onClick={onOpen}>
        商品の受け取り完了
      </Button>
      <OrderReceivedConfirmDialog isOpen={isOpen} onClose={onClose} handleOnClick={handleClickConfirm} />
    </>
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

const ShopInfo = ({ shopName, shopShortName, latLng }: { shopName: string; shopShortName: string; latLng: LatLng }) => {
  return (
    <Flex flexDirection="column">
      <Text mb="24px" fontSize="24px" fontWeight="bold" lineHeight="33.6px">
        {/* 表示は短縮店舗名を表示する */}
        {shopShortName}
      </Text>
      <FacilityLocationMap
        location={{
          lat: latLng.latitude,
          lng: latLng.longitude,
        }}
      />
      <Flex justifyContent="end" pt="16px" pb="16px">
        {/* こちらはGoogleMapの検索に使うため、なるべく正式な名称が良いためshopNameを利用する */}
        <CheckShopLocationButton shopName={shopName} />
      </Flex>
    </Flex>
  );
};

const CheckShopLocationButton = ({ shopName }: { shopName: string }) => {
  const handleClick = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shopName)}`);
  };
  return (
    <Button variant="link" display="flex" flexDirection="row" gap="4px" textDecoration="none" onClick={handleClick}>
      <LocationIcon boxSize="16px" />
      <Text as="span">お店の場所を確認する</Text>
    </Button>
  );
};
