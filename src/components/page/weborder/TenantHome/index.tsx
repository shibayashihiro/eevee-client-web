import { Box, Flex, Image, Spacer, Text, VStack, Button, Container  } from '@chakra-ui/react';
import { useCallback } from 'react';
import variables from '@/styles/variables.module.scss';
import { Navbar } from '@/components/domain/Navbar';
import { HomeHeader } from '@/components/domain/HomeHeader'; 
import { TenantPageLink } from '@/components/domain/TenantPageLink';
import { PrimaryButton } from '@/components/ui/Button';
import { WrappedLink } from '@/components/ui/WrappedLink';
import { OrderType } from '@/graphql/generated/types';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useTenantRouter, useTenantUid, useUICustomization } from '@/providers/tenant/WebOrderPageStateProvider';
import { NextPageWithLayout } from '@/types';
import { containerMarginX } from '@/utils/constants';
import { privacyPage, shopListPage } from '@/utils/paths/tenantPages';
import { validateQueryTenantIdentifier } from '@/utils/validator';
import { apps } from '@/apps';
import { useGetWebHomeSectionsForTenantPageQuery } from './TenantHome.query.generated';

type FooterLink = {
  label: string;
  href: string;
  isExternal: boolean;
};

// TODO(anyone): テイクアウトのみのブランドが増えた場合はTenantに専用フィールドを追加等して設定できるようにすると良さそう
const takeoutTenantIds = [
  'wQwAvAIqkUt6vfoWKv4C', // いきなりステーキ
];

const TenantHome: NextPageWithLayout = () => {
  const router = useTenantRouter();
  const tenantId = useTenantUid();
  const uiCustom = useUICustomization();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();
  const cfg = validateQueryTenantIdentifier(router.query) ? apps.getConfig(router.query.tenantIdentifier) : null;
  const promotionEnabled = cfg?.promotionEnabled;
  const navbarOrderType = (tenantId: string) => {
    if (takeoutTenantIds.includes(tenantId)) {
      return OrderType.Takeout;
    }
    return OrderType.Delivery;
  };

  const [result] = useGetWebHomeSectionsForTenantPageQuery();

  const handleClickShopSelectButton = useCallback(() => {
    router.push(shopListPage);
  }, [router]);

  const { data, fetching, error } = result;
  useLoadingOverlay(fetching);
  if (error) {
    handleErrorWithAlertDialog(error);
  }
  if (fetching) {
    return null;
  }
  if (!data) {
    throw new Error('not found');
  }

  const { helpUrl, termsOfUseUrl, specifiedCommercialTransactionActUrl } = data.viewing;
  const footerLinks: FooterLink[] = [
    { label: '困ったときは', href: helpUrl, isExternal: true },
    { label: '利用規約', href: termsOfUseUrl, isExternal: true },
    { label: 'プライバシーポリシー', href: privacyPage, isExternal: false },
    { label: '特定商取引法に基づく表記', href: specifiedCommercialTransactionActUrl, isExternal: true },
  ];
  return (
    <>
      <Navbar viewing={data.viewing} viewer={data.viewer} facility={null} orderType={navbarOrderType(tenantId)} />
      {!promotionEnabled && (
        <HomeHeader userName="ゲストさん" containerMaxWidth={variables.containerMaxWidth} />
      )}
      {promotionEnabled ? (
            <>
            <VStack>
              <Image
                src={data.viewing.mainVisualImage}
                alt="メイン画像"
                h={{ base: '187px', md: '320px' }}
                w="full"
                objectFit="cover"
                objectPosition={'50% 50%'}
              />
            </VStack>
            <Flex direction="column" mt="40px" mx={containerMarginX} alignItems="center">
              <Text className="bold-large" mt="24px">
                まずは注文する店舗を選んでください💡
              </Text>
              <PrimaryButton mt="32px" h="56px" onClick={handleClickShopSelectButton}>
                店舗を選ぶ
              </PrimaryButton>
              {uiCustom?.tenantHomeNoteText && (
                <Text mt="16px" className="bold-extra-small" color="mono.secondary">
                  {uiCustom.tenantHomeNoteText}
                </Text>
              )}
            </Flex>
            <Spacer h="64px" />
          </>
        ) : (
      
      <Container maxW={variables.containerMaxWidth}>
        <Flex mt="24px" justifyContent="center" gap={4}  mx="auto">
          <Button
            bg={variables.monoSub}
            borderRadius="md"
            w="312px"
            h="96px"
            fontWeight="bold"
            color="white"
          >
            <Flex direction="column" align="center" justify="center">
              <Image src="/assets/icons/bike.svg"/>
              <Text mt={2}>宅配・デリバリーでご注文</Text>
            </Flex>          
          </Button>
          <Button
            bg={variables.monoSub}
            borderRadius="md"
            w="312px"
            h="96px"
            fontWeight="bold"
            color="white"
          >
            <Flex direction="column" align="center" justify="center">
              <Image src="/assets/icons/mobile.svg"/>
              <Text mt={2}>お持ち帰りでご注文</Text>
            </Flex>
          </Button>
        </Flex>
        <Flex mt="24px" justifyContent="center" gap={4}  mx="auto">
          <VStack mx="auto" alignItems="center" borderRadius="md">
            <Image
              src={data.viewing.mainVisualImage}
              alt="メイン画像"
              w="312px"
              h={{ base: '120px'}}
              objectFit="fill"
            />
          </VStack>
          <VStack mx="auto" alignItems="center" borderRadius="md">
            <Image
              src={data.viewing.mainVisualImage}
              alt="メイン画像"
              w="312px"
              h={{ base: '120px'}}
              objectFit="fill"
            />
          </VStack>
        </Flex>
        
      </Container>
      )}
      <Box w="full" bg="mono.bg" pt="32px" pb="48px">
        <Box maxW="800px" mx="auto" px={containerMarginX}>
          <VStack alignItems="start">
            {footerLinks.map((footerLink, i) =>
              footerLink.isExternal ? (
                <WrappedLink href={footerLink.href} key={i} target="_blank">
                  {footerLink.label}
                </WrappedLink>
              ) : (
                <TenantPageLink href={footerLink.href} key={i} target="_blank">
                  {footerLink.label}
                </TenantPageLink>
              ),
            )}
          </VStack>
          <Text mt="24px" className="text-extra-small" color="mono.secondary">
            © {data.viewing.companyName} / powered by Chompy
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default TenantHome;
