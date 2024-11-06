import React, { useCallback, useEffect, useState } from 'react';

import { NextPageWithLayout } from '@/types';
import { InsideNavbar } from '@/components/ui/InsideNavbar';
import { localizedMessages } from '@/utils/errors';
import { useGetCouponQuery } from '@/components/page/weborder/Coupon/Coupon.query.generated';
import { CouponList } from '@/components/domain/CouponList';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { couponAddPage } from '@/utils/paths/tenantPages';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { Coupon } from '@/graphql/generated/types';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { InfiniteScroll } from '@/components/ui/InfiniteScroll';

const CouponPage: NextPageWithLayout = () => {
  const router = useTenantRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [after, setAfter] = useState<string | null>(null);
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const { ...queryParams } = router.query;

  const { cartId, selectedCouponId } = queryParams;

  const selectable = cartId != undefined && typeof cartId === 'string';
  const title = selectable ? '利用可能なクーポン' : '所持しているクーポン';

  const handleClickBackIcon = useCallback(async () => {
    router.back();
  }, [router]);

  const handleClickTrailing = useCallback(async () => {
    await router.push(couponAddPage);
  }, [router]);

  const [result] = useGetCouponQuery({
    variables: {
      cartID: selectable ? cartId : undefined,
      after,
    },
  });

  const { data, fetching, error } = result;
  useLoadingOverlay(fetching);
  if (error) {
    handleErrorWithAlertDialog(error);
  }
  const { viewer } = data ?? {};
  if (!fetching && !data) {
    handleErrorWithAlertDialog(new Error(localizedMessages.NotFoundError));
  }

  const loadMore = () => {
    if (fetching || !viewer || !viewer.coupons.pageInfo.hasNextPage) {
      return;
    }
    setAfter(viewer.coupons.pageInfo.endCursor ?? null);
  };

  useEffect(() => {
    if (data?.viewer) {
      setCoupons([...coupons, ...data.viewer.coupons.nodes]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.viewer]);

  return (
    <>
      <InsideNavbar
        title={title}
        onClickBackIcon={handleClickBackIcon}
        trailing={{
          text: 'コードから追加',
          onClick: handleClickTrailing,
        }}
      />
      {viewer && (
        <InfiniteScroll hasMore={viewer.coupons.pageInfo.hasNextPage} loadMore={loadMore}>
          <CouponList
            coupons={coupons}
            cartId={selectable ? cartId : undefined}
            selectedCouponId={
              selectable && typeof selectedCouponId === 'string' && selectedCouponId ? selectedCouponId : null
            }
          />
        </InfiniteScroll>
      )}
    </>
  );
};

export default CouponPage;
