import { Box, Flex, Image, Spacer, Text, VStack } from '@chakra-ui/react';
import { useCallback } from 'react';

import { Navbar } from '@/components/domain/Navbar';
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
      <Box w="full" bg="mono.bg" pt="32px" pb="48px" px={containerMarginX}>
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
    </>
  );
};

export default TenantHome;
