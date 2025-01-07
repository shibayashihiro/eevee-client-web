import { Box, Center, HStack, Text } from '@chakra-ui/react';
import { useMemo } from 'react';

import { PersonIcon } from '@/components/ui/Icons/PersonIcon';
import { useAuthUser } from '@/auth/provider/AuthUserProvider';
import { useResolvedHomePath } from '@/providers/tenant/WebOrderPageStateProvider';
import { loginOrSignUpPage, myPage, myPageOrderHistory } from '@/utils/paths/tenantPages';
import { MemoIcon } from '@/components/ui/Icons/MemoIcon';

import { TenantPageLink } from '../TenantPageLink';

export const PromotionEnabledNavbarMenu = () => {
  const navItems = useNavigationItems();
  return (
    <HStack as="ul" spacing="16px" listStyleType="none" alignItems="end">
      {navItems.map((item, index) => (
        <Box key={index} as="li">
          <IconLink {...item} />
        </Box>
      ))}
    </HStack>
  );
};

const useNavigationItems = () => {
  const { isAnonymous } = useAuthUser();
  const home = useResolvedHomePath();

  return useMemo(() => {
    if (isAnonymous) {
      return buildNavigationItemsForAnonymousUser(home);
    }
    return buildNavigationItemsForSignedInUser();
  }, [home, isAnonymous]);
};

const buildNavigationItemsForAnonymousUser = (home: string) => {
  return [
    {
      icon: <MemoIcon boxSize="24px" role="presentation" />,
      label: '注文履歴',
      href: myPageOrderHistory,
    },
    {
      icon: <PersonIcon boxSize="24px" role="presentation" />,
      label: '会員登録・ログイン',
      href: loginOrSignUpPage(home),
    },
  ];
};

const buildNavigationItemsForSignedInUser = () => {
  return [
    {
      icon: <MemoIcon boxSize="24px" role="presentation" />,
      label: '注文履歴',
      href: myPageOrderHistory,
    },
    {
      icon: <PersonIcon boxSize="24px" role="presentation" />,
      label: 'マイページ',
      href: myPage,
    },
  ];
};

type NavbarMenuItem = {
  icon: React.ReactNode;
  label: string;
  href: string;
};

const IconLink = ({ icon, label, href }: NavbarMenuItem) => {
  return (
    <TenantPageLink
      href={href}
      display="flex"
      flexDirection="column"
      alignItems="center"
      h="full"
      _hover={{ textDecoration: 'none' }}
    >
      <Center boxSize="24px">{icon}</Center>
      <Text textStyle="text-extra-small">{label}</Text>
    </TenantPageLink>
  );
};
