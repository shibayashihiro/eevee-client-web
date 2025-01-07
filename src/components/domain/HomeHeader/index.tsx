import { Box, Flex, Text, Button, Container, HStack } from '@chakra-ui/react';

import { useAuthUser } from '@/auth/provider/AuthUserProvider';
import { useResolvedHomePath, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { loginPage, myPageCoupon } from '@/utils/paths/tenantPages';
import { CouponIcon } from '@/components/ui/Icons/CouponIcon';
import { safeUserNameForDisplay } from '@/utils/domain/user';

import { HomeHeaderFragment } from './HomeHeader.fragment.generated';

type HomeHeaderProps = {
  viewer: HomeHeaderFragment;
  userName?: string;
  containerMaxWidth?: string;
};

export const HomeHeader = ({ viewer, containerMaxWidth }: HomeHeaderProps) => {
  const router = useTenantRouter();
  const home = useResolvedHomePath();

  const user = useAuthUser();

  const handleClickCoupon = async () => {
    await router.push(myPageCoupon);
  };

  const handleLoginClick = async () => {
    await router.push(loginPage(home));
  };

  const userName = safeUserNameForDisplay(user?.isAnonymous, viewer?.profile?.lastNameKana);

  return (
    <Box bg={'brand.primary'} color="white" py="10px" px={{ base: '20px', md: '40px' }}>
      <Container maxW={containerMaxWidth}>
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize="lg" fontWeight="bold">
            {userName}
          </Text>
          <Flex gap="12px" alignItems="center">
            {user && !user.isAnonymous ? (
              <Button
                bg="white"
                color="mono.primary"
                fontWeight="bold"
                borderRadius="full"
                px="16px"
                _hover={{ bg: 'gray.100' }}
                onClick={handleClickCoupon}
              >
                <HStack spacing="4px">
                  <CouponIcon boxSize="20px" />
                  <Text>所有クーポン {viewer?.coupons?.nodes?.length ?? 0}点</Text>
                </HStack>
              </Button>
            ) : (
              <Button
                bg="white"
                color="brand.primary"
                fontWeight="bold"
                borderRadius="full"
                px="16px"
                _hover={{ bg: 'gray.100' }}
                onClick={handleLoginClick}
              >
                会員登録・ログイン
              </Button>
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};
