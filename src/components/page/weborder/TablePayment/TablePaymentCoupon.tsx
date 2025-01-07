import { Box, HStack, Spacer, Text } from '@chakra-ui/react';

import variables from '@/styles/variables.module.scss';
import { Coupon } from '@/graphql/generated/types';
import { TenantPageLink } from '@/components/domain/TenantPageLink';
import { couponPage } from '@/utils/paths/tenantPages';

type Props = {
  coupons: Coupon[];
  couponId: string;
};

export const TablePaymentCoupon = ({ coupons, couponId }: Props) => {
  const coupon = coupons.find((c) => c.id === couponId);
  return (
    <Box mt="8px" mb="16px" width="full">
      <Text
        className="bold-extra-small"
        pb="8px"
        color={variables.monoSecondary}
        borderBottom="1px"
        borderColor={variables.monoBackGround}
      >
        クーポン
      </Text>
      <Box pt="16px" pb="16px" className="text-extra-small" borderBottom="1px" borderColor="mono.bg">
        {coupon ? (
          <HStack>
            <Text className="bold-small">{coupon.title}</Text>
            <Spacer />
            <TenantPageLink href={couponPage({ selectedCouponId: coupon.id, isTableOrder: 'true' })}>
              <Text className="text-small" color="brand.primaryText">
                変更する
              </Text>
            </TenantPageLink>
          </HStack>
        ) : (
          <TenantPageLink href={couponPage({ isTableOrder: 'true' })}>
            <Text className="bold-small"> クーポンコードを入力して追加する</Text>
          </TenantPageLink>
        )}
      </Box>
    </Box>
  );
};
