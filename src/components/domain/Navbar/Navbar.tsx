import { Box, HStack, Spacer, VStack, Text, Image } from '@chakra-ui/react';
import { Person, HelpOutline } from '@mui/icons-material'; 
import { OrderType } from '@/graphql/generated/types';
import { useResolvedHomePath } from '@/providers/tenant/WebOrderPageStateProvider';

import { Logo } from './Logo';
import { NavbarViewerPartsFragment, NavbarViewingPartsFragment } from './Navbar.fragment.generated';
import { NavbarMenu, ItemSearchMethodButtonType } from './NavbarMenu';
import { NavbarMenuFacilityFragment } from './NavbarMenu.fragment.generated';
import { useRouter } from 'next/router';
import { validateQueryTenantIdentifier } from '@/utils/validator';
import { apps } from '@/apps';

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
  const router = useRouter();
  const cfg = validateQueryTenantIdentifier(router.query) ? apps.getConfig(router.query.tenantIdentifier) : null;
  return (
    <HStack
      as="nav"
      h="80px"
      bg="white"
      borderBottomStyle="solid"
      borderBottomWidth={'4px'}
      borderBottomColor={ cfg?.promotionEnabled? "brand.primary": "mono.primary"}
      py="22px"
      px="20px"
      justifyContent={'space-between'}
      alignItems={'center'}
    >

      <Logo imageUrl={viewing.logo} homePath={disableHomeLink ? undefined : home} />

      <Spacer />
      {cfg?.promotionEnabled ? (
        <Box px="12px">
          <NavbarMenu
            viewer={viewer}
            facility={facility}
            orderType={orderType}
            showOrderHistory={props.showOrderHistory}
            itemSearchMethodButtonType={props.itemSearchMethodButtonType}
          />
        </Box>
      ) : (
      <HStack spacing="24px">
        <VStack spacing="4px" align="center">
          <Image src="/assets/icons/memo.svg" boxSize="24px" alt="注文履歴アイコン" /> 
          <Text fontSize="sm">注文履歴</Text>
        </VStack>

        <VStack spacing="4px" align="center">
          <Image src="/assets/icons/help.svg" boxSize="24px" alt="" /> 
          <Text fontSize="sm">ヘルプ</Text>
        </VStack>
      </HStack> 
      )}     
    </HStack>
    );
};
