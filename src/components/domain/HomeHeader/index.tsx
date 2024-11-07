// HomeHeader.tsx
import { Box, Flex, Text, Button, Container } from '@chakra-ui/react';
import { useResolvedHomePath, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { loginPage } from '@/utils/paths/tenantPages';
type HomeHeaderProps = {
  userName?: string;
  containerMaxWidth?: string;
};

export const HomeHeader = ({ userName = 'ゲストさん', containerMaxWidth }: HomeHeaderProps) => {
  const router = useTenantRouter();
  const home = useResolvedHomePath();

  const handleLoginClick = async () => {
    await router.replace(loginPage(home));
  };
  return (
    <Box bg="mono.primary" color="white" py={2}>
      <Container maxW={containerMaxWidth}>
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize="lg" fontWeight="bold">
            {userName}
          </Text>          
          <Flex gap="12px" alignItems="center">
            <Button
                bg="white" 
                color="black" 
                fontWeight="bold"
                borderRadius="full"
                px="16px"
                _hover={{
                    bg: "gray.100", 
                }}
                onClick={handleLoginClick}
            >
            会員登録・ログイン
            </Button>

          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};
