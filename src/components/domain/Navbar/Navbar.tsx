import { HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { OrderType } from '@/graphql/generated/types';
import { useResolvedHomePath } from '@/providers/tenant/WebOrderPageStateProvider';
import { validateQueryTenantIdentifier } from '@/utils/validator';
import { apps } from '@/apps';
import { home } from '@/utils/paths/tenantPages';

import {
  NavbarViewerPartsFragment,
  NavbarViewingPartsFragment,
  NavbarMenuFacilityFragment,
} from './Navbar.fragment.generated';
import { GeneralNavbarMenu } from './GeneralNavbarMenu';
import { Logo } from './Logo';
import { ItemSearchMethodButtonType } from './types';
import { PromotionEnabledNavbarMenu } from './PromotionEnabledNavbarMenu';

type Props = {
  viewing: NavbarViewingPartsFragment;
  viewer: NavbarViewerPartsFragment;
  facility: NavbarMenuFacilityFragment | null;
  orderType?: OrderType;
  disableHomeLink?: boolean;
  itemSearchMethodButtonType?: ItemSearchMethodButtonType;
  showOrderHistory?: boolean;
  showTableOrderPayment?: boolean;
};

export const Navbar = (props: Props) => {
  const { viewing, viewer, facility, disableHomeLink, orderType } = props;
  const selectedShopHome = useResolvedHomePath();
  const router = useRouter();
  const cfg = validateQueryTenantIdentifier(router.query) ? apps.getConfig(router.query.tenantIdentifier) : null;

  return (
    <HStack
      as="nav"
      h="78px"
      bg="white"
      borderBottomStyle="solid"
      borderBottomWidth="2px"
      borderBottomColor="brand.primary"
      py="16px"
      pl="16px"
      pr="12px"
      justifyContent="space-between"
      alignItems="center"
    >
      <Logo
        imageUrl={viewing.logo}
        homePath={cfg?.promotionEnabled ? home : disableHomeLink ? undefined : selectedShopHome}
      />
      {cfg?.promotionEnabled ? (
        <PromotionEnabledNavbarMenu />
      ) : (
        <GeneralNavbarMenu
          viewer={viewer}
          facility={facility}
          orderType={orderType}
          showOrderHistory={props.showOrderHistory}
          showTableOrderPayment={props.showTableOrderPayment}
          itemSearchMethodButtonType={props.itemSearchMethodButtonType}
        />
      )}
    </HStack>
  );
};
