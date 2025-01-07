import { useCallback } from 'react';
import { Container, Flex } from '@chakra-ui/react';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { InsideNavbar } from '@/components/ui/InsideNavbar';
import CouponDetailCard from '@/components/domain/CouponDetailCard';
import { NextPageWithLayout } from '@/types';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';

import { useGetCouponByIdQuery } from './Coupon.query.generated';

const CouponDetailPage: NextPageWithLayout = () => {
  const router = useTenantRouter();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const { couponId } = router.query;

  const [{ data, fetching, error }] = useGetCouponByIdQuery({
    variables: { couponId: couponId as string },
    pause: !couponId,
  });

  const handleClickBackIcon = useCallback(() => {
    router.back();
  }, [router]);

  if (fetching) return <LoadingSpinner />;

  if (error) {
    handleErrorWithAlertDialog(error);
    return null;
  }

  const coupon = data?.Coupon;
  if (!coupon || coupon.__typename !== 'Coupon') {
    return;
  }
  return (
    <Flex h="100vh" flexDirection="column">
      <InsideNavbar title="クーポン利用" onClickBackIcon={handleClickBackIcon} />
      <Container flex={1}>
        <CouponDetailCard coupon={coupon} />
      </Container>
    </Flex>
  );
};

export default CouponDetailPage;
