import { Box, Text, VStack } from '@chakra-ui/react';

import variables from '@/styles/variables.module.scss';
import { HomeHeader } from '@/components/domain/HomeHeader';
import { HomeContainer } from '@/components/domain/HomeContainerSection';
import { HomeContainerPromotionEnabled } from '@/components/domain/HomeContainerPromotionEnabledSection';
import { TenantPageLink } from '@/components/domain/TenantPageLink';
import { WrappedLink } from '@/components/ui/WrappedLink';
import { Coupon, OrderType, Profile } from '@/graphql/generated/types';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useTenantRouter, useTenantUid } from '@/providers/tenant/WebOrderPageStateProvider';
import { NextPageWithLayout } from '@/types';
import { containerMarginX } from '@/utils/constants';
import { validateQueryTenantIdentifier } from '@/utils/validator';
import { apps } from '@/apps';
import { NavigationHeaderLayout } from '@/components/layouts/NavigationHeaderLayout';
import { privacyPage } from '@/utils/paths/tenantPages';
import { useAdditionalTypeNamesContext } from '@/graphql/helper';

import { TenantHomeFooterInfoFragment, useGetWebHomeSectionsForTenantPageQuery } from './TenantHome.query.generated';

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

  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();  

  const cfg = validateQueryTenantIdentifier(router.query) ? apps.getConfig(router.query.tenantIdentifier) : null;
  const promotionEnabled = cfg?.promotionEnabled;
  const navbarOrderType = (tenantId: string) => {
    if (takeoutTenantIds.includes(tenantId)) {
      return OrderType.Takeout;
    }
    return OrderType.Delivery;
  };

  const context = useAdditionalTypeNamesContext<[Profile, Coupon]>([
    // プロフィールを表示しているので、contextに加える
    'Profile',
    // クーポン枚数を表示しているので、contextに加える
    'Coupon',
  ]);
  const [result] = useGetWebHomeSectionsForTenantPageQuery({ context });

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
  const bannerSectionData = data.viewing;

  return (
    <NavigationHeaderLayout
      subHeader={
        promotionEnabled && <HomeHeader viewer={data.viewer} containerMaxWidth={variables.containerMaxWidth} />
      }
      footer={<HomeFooter tenant={data.viewing} />}
      viewing={data.viewing}
      viewer={data.viewer}
      facility={null}
      orderType={navbarOrderType(tenantId)}
    >
      {promotionEnabled ? (
        <HomeContainerPromotionEnabled bannerSection={bannerSectionData} />
      ) : (
        <HomeContainer mainVisualImage={data.viewing.mainVisualImage} />
      )}
    </NavigationHeaderLayout>
  );
};

const HomeFooter = ({ tenant }: { tenant: TenantHomeFooterInfoFragment }) => {
  const { helpUrl, contactUrl, termsOfUseUrl, privacyPolicyUrl, specifiedCommercialTransactionActUrl, companyName } =
    tenant;
  const footerLinks: FooterLink[] = [
    { label: 'FAQ', href: helpUrl, isExternal: true },
    { label: 'お問い合わせ', href: contactUrl, isExternal: true },
    { label: '利用規約', href: termsOfUseUrl, isExternal: true },
    privacyPolicyUrl
      ? { label: 'プライバシーポリシー', href: privacyPolicyUrl, isExternal: true }
      : { label: 'プライバシーポリシー', href: privacyPage, isExternal: false },
    { label: '特定商取引法に基づく表記', href: specifiedCommercialTransactionActUrl, isExternal: true },
  ];
  return (
    <Box as="footer" w="full" bg="mono.bg" pt="32px" pb="48px">
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
          {`© ${companyName} / powered by Chompy`}
        </Text>
      </Box>
    </Box>
  );
};

export default TenantHome;
