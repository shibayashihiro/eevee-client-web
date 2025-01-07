import {
  Avatar,
  Center,
  HStack,
  Icon,
  IconButton,
  LinkBox,
  LinkOverlay,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import liff from '@line/liff';
import { HelpOutline } from '@mui/icons-material';
import { useCallback } from 'react';

import { ActionKeyIcon } from '@/components/ui/Icons/ActionKeyIcon';
import { CheckIcon } from '@/components/ui/Icons/CheckIcon';
import { NumberSearchIcon } from '@/components/ui/Icons/PinIcon';
import { NextLink } from '@/components/ui/NextLink';
import { WrappedLink } from '@/components/ui/WrappedLink';
import { OrderType } from '@/graphql/generated/types';
import { useAuthUser } from '@/auth/provider/AuthUserProvider';
import {
  useFacilityId,
  useFacilityIdOrNull,
  useResolvedHomePath,
  useTenantIdentifier,
  useTenantRouter,
} from '@/providers/tenant/WebOrderPageStateProvider';
import { myPageStampCard, searchItemPage, tableOrdersPage, tableOrdersPaymentPage } from '@/utils/paths/facilityPages';
import { loginOrSignUpPage } from '@/utils/paths/tenantPages';
import { OrderHistoryIcon } from '@/components/ui/Icons/OrderHistoryIcon';
import { OrderPaymentIcon } from '@/components/ui/Icons/OrderPaymentIcon';
import { setItemCodeForSearchMethod, setItemListForSearchMethod } from '@/utils/localstorage/item_search_method';

import { LogoutDialog } from '../LogoutDialog';

import { GeneralNavbarMenuFacilityFragment, GeneralNavbarMenuViewerFragment } from './GeneralNavbarMenu.generated';
import { ItemSearchMethodButtonType } from './types';

// いきなりステーキさまでは、テイクアウト機能のみをWebViewという形で提供しており、
// どの画面からもテイクアウトのヘルプを表示する。
const specialTenantIdentifier = 'ikinaristeak'; // いきなりステーキさま

type Props = {
  viewer: GeneralNavbarMenuViewerFragment;
  facility: GeneralNavbarMenuFacilityFragment | null;
  orderType?: OrderType;

  itemSearchMethodButtonType?: ItemSearchMethodButtonType;
  showOrderHistory?: boolean;
  showTableOrderPayment?: boolean;
};

export const GeneralNavbarMenu = (props: Props) => {
  const facilityId = useFacilityIdOrNull();

  if (facilityId) {
    return (
      <HStack spacing="14px">
        <TransitionButton orderType={props.orderType} buttonType={props.itemSearchMethodButtonType} />
        {props.orderType === OrderType.EatIn && (
          <>
            {props.showTableOrderPayment && <OrderPayment />}
            {props.showOrderHistory && <OrderHistory />}
          </>
        )}
        <FacilityNavbarMenu {...props} />;
      </HStack>
    );
  }
  return <TenantNavbarMenu {...props} />;
};
type TransitionButtonProps = {
  orderType?: OrderType;
  buttonType?: ItemSearchMethodButtonType;
};

const TransitionButton = ({ orderType, buttonType }: TransitionButtonProps) => {
  switch (buttonType) {
    case ItemSearchMethodButtonType.None:
      return null;
    case ItemSearchMethodButtonType.ShowItemList:
      return <ItemList />;
    case ItemSearchMethodButtonType.ShowItemCodeForm:
      return <ItemCodeForm orderType={orderType} />;
    default:
      return null;
  }
};

// Facility選択前のNavbar
const TenantNavbarMenu = (props: Props) => {
  const tenantIdentifier = useTenantIdentifier();

  if (tenantIdentifier === specialTenantIdentifier) {
    return <HelpLink orderType={OrderType.Takeout} />;
  }
  return <UserMenu {...props} />;
};

// Facility選択後のNavbar
const FacilityNavbarMenu = ({ viewer, orderType, facility }: Props) => {
  if (!orderType) {
    return null;
  }
  // デリバリーの時は会員登録必須のため、ユーザーメニューを表示。
  // それ以外はヘルプリンクを表示。
  if (orderType === OrderType.Delivery) {
    return <UserMenu viewer={viewer} />;
  }

  if (
    liff.isInClient() /* 現状、LINEでしかユーザーを追跡できないため、LINEの時のみ表示する */ &&
    facility?.featureFlags.loyaltyProgramEnabled &&
    viewer.loyaltyCard !== null &&
    viewer.loyaltyCard !== undefined
  ) {
    return <LoyaltyMenu />;
  }

  return <HelpLink orderType={orderType} />;
};

const UserMenu = ({ viewer }: { viewer: GeneralNavbarMenuViewerFragment }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useTenantRouter();
  const home = useResolvedHomePath();
  const { isAnonymous } = useAuthUser();

  const onAvatarClick = useCallback(() => {
    if (isAnonymous) {
      router.push(loginOrSignUpPage(home));
    } else {
      onOpen();
    }
  }, [home, isAnonymous, onOpen, router]);

  // LINEミニアプリログイン中の会員登録等は未サポートのため、nullを返す
  if (liff.isInClient()) {
    return null;
  }

  return (
    <>
      <IconButton
        variant="none"
        colorScheme="blue"
        aria-label="Search database"
        icon={
          <Avatar src={viewer?.profile?.imageUrl} boxSize="32px" border="1px" color="mono.divider" bg="mono.divider" />
        }
        onClick={onAvatarClick}
      />
      <LogoutDialog isOpen={isOpen} onClose={onClose} />
    </>
  );
};

const HelpLink = ({ orderType }: { orderType: OrderType }) => {
  const tenantIdentifier = useTenantIdentifier();

  let helpUrl = '';
  switch (orderType) {
    case OrderType.EatIn:
      helpUrl = 'https://chompy.notion.site/c3270263539343e285fb91d1ad021554';
      break;
    case OrderType.Delivery:
      throw new Error('delivery help url is not implemented yet');
    case OrderType.Takeout:
      helpUrl = getTakeoutHelpUrl(tenantIdentifier);
      break;
  }

  return (
    <WrappedLink
      display={'flex'} // 上下中央に寄せるため
      href={helpUrl}
      isExternal
      style={{ textDecoration: 'none' }}
    >
      <VStack spacing="0">
        <Icon as={HelpOutline} boxSize="24px" />
        <Text className="text-extra-small">ヘルプ</Text>
      </VStack>
    </WrappedLink>
  );
};

const LoyaltyMenu = () => {
  const facilityId = useFacilityId();
  return (
    <LinkBox>
      <VStack align="center" spacing="2px">
        <Center bg="mono.primary" h="26.67px" w="26.67px" borderRadius="50%">
          <CheckIcon color="mono.white" />
        </Center>
        <LinkOverlay as={NextLink} href={myPageStampCard(facilityId)}>
          <Text className="bold-micro">スタンプカード</Text>
        </LinkOverlay>
      </VStack>
    </LinkBox>
  );
};

const getTakeoutHelpUrl = (tenantIdentifier: string) => {
  if (tenantIdentifier === 'ikinaristeak') {
    return 'https://help.chompy.jp/restaurant-original-user/ikinari-steak-webtakeout';
  }
  if (liff.isInClient()) {
    return 'https://help.chompy.jp/restaurant-original-user/line-miniapp-takeout';
  }
  return 'https://help.chompy.jp/restaurant-original-user/web-takeout';
};

export const ItemCodeForm = ({ orderType }: { orderType?: OrderType }) => {
  const facilityId = useFacilityId();

  return (
    <WrappedLink as={NextLink} href={searchItemPage(facilityId, orderType!)}>
      <VStack spacing="0" onClick={() => setItemCodeForSearchMethod()}>
        <Icon as={NumberSearchIcon} boxSize="24px" />
        <Text className="text-extra-small">番号入力</Text>
      </VStack>
    </WrappedLink>
  );
};

export const ItemList = () => {
  return (
    <WrappedLink as={NextLink} href={useResolvedHomePath()}>
      <VStack spacing="0" onClick={() => setItemListForSearchMethod()}>
        <Icon as={ActionKeyIcon} boxSize="24px" />
        <Text className="text-extra-small">商品一覧</Text>
      </VStack>
    </WrappedLink>
  );
};

export const OrderHistory = () => {
  const facilityId = useFacilityId();

  return (
    <WrappedLink as={NextLink} href={tableOrdersPage(facilityId)}>
      <VStack spacing="0">
        <Icon as={OrderHistoryIcon} boxSize="24px" />
        <Text className="text-extra-small">注文履歴</Text>
      </VStack>
    </WrappedLink>
  );
};

export const OrderPayment = () => {
  const facilityId = useFacilityId();

  return (
    <WrappedLink as={NextLink} href={tableOrdersPaymentPage(facilityId)}>
      <VStack spacing="0">
        <Icon as={OrderPaymentIcon} boxSize="24px" />
        <Text className="text-extra-small">お会計</Text>
      </VStack>
    </WrappedLink>
  );
};
