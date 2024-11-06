import { Box, HStack } from '@chakra-ui/react';

import { OrderType } from '@/graphql/generated/types';
import { useResolvedHomePath } from '@/providers/tenant/WebOrderPageStateProvider';

import { Logo } from './Logo';
import { NavbarViewerPartsFragment, NavbarViewingPartsFragment } from './Navbar.fragment.generated';
import { NavbarMenu, ItemSearchMethodButtonType } from './NavbarMenu';
import { NavbarMenuFacilityFragment } from './NavbarMenu.fragment.generated';

export * from './Navbar.fragment.generated';

type Props = {
  viewing: NavbarViewingPartsFragment;
  viewer: NavbarViewerPartsFragment;
  facility: NavbarMenuFacilityFragment | null;
  orderType?: OrderType;
  disableHomeLink?: boolean;
  itemSearchMethodButtonType?: ItemSearchMethodButtonType;
  showOrderHistory?: boolean;
};

export const Navbar = (props: Props) => {
  const { viewing, viewer, facility, disableHomeLink, orderType } = props;
  const home = useResolvedHomePath();
  return (
    <HStack
      as="nav"
      h="80px"
      bg="white"
      borderBottomStyle="solid"
      borderBottomWidth={'4px'}
      borderBottomColor="brand.primary"
      py="22px"
      px="20px"
      justifyContent={'space-between'}
      alignItems={'center'}
    >
      <Logo imageUrl={viewing.logo} homePath={disableHomeLink ? undefined : home} />
      <Box px="12px">
        <NavbarMenu
          viewer={viewer}
          facility={facility}
          orderType={orderType}
          showOrderHistory={props.showOrderHistory}
          itemSearchMethodButtonType={props.itemSearchMethodButtonType}
        />
      </Box>
    </HStack>
  );
};
