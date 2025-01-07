import React, { useCallback, useEffect, useState } from 'react';
import { Container } from '@chakra-ui/react';

import { NextPageWithLayout } from '@/types';
import { InsideNavbar } from '@/components/ui/InsideNavbar';
import { localizedMessages } from '@/utils/errors';
import { useGetCouponQuery } from '@/components/page/weborder/Coupon/Coupon.query.generated';
import { CouponList } from '@/components/domain/CouponList';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { couponAddPage } from '@/utils/paths/tenantPages';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { InfiniteScroll } from '@/components/ui/InfiniteScroll';
import { CouponCardForListFragment } from '@/components/domain/CouponCard/CouponCard.fragment.generated';

const CouponPage: NextPageWithLayout = () => {
  const router = useTenantRouter();
  const [coupons, setCoupons] = useState<CouponCardForListFragment[]>([]);
  const [after, setAfter] = useState<string | null>(null);
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const { ...queryParams } = router.query;
  const { cartId, selectedCouponId, isTableOrder } = queryParams;

  // カートにかかわる処理で使われているためisTableOrderは考慮しない
  const selectable = cartId != undefined && typeof cartId === 'string';
  const title = selectable ? '利用可能なクーポン' : '所有クーポン';
  // クーポンが選択される場合は、カートが指定されているorテーブル注文での会計のみ
  // このページへはcartIdが空&isTableOrderがfalseでselectedCouponIdを指定できてしまうため確認する
  const selected =
    typeof selectedCouponId === 'string' && selectedCouponId && (selectable || isTableOrder == 'true')
      ? selectedCouponId
      : null;

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
      isAvailable: isTableOrder == 'true' ? true : undefined,
    },
    // このクーポン一覧画面は、カート画面からクーポンをすぐ使うために遷移してきたりするため、常に最新を表示する
    requestPolicy: 'network-only',
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
      setCoupons([...data.viewer.coupons.nodes]);
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
        <Container as="main">
          <InfiniteScroll hasMore={viewer.coupons.pageInfo.hasNextPage} loadMore={loadMore}>
            <CouponList
              coupons={coupons}
              cartId={selectable ? cartId : undefined}
              isTableOrder={isTableOrder == 'true' ? true : false}
              selectedCouponId={selected}
            />
          </InfiniteScroll>
        </Container>
      )}
    </>
  );
};

export default CouponPage;
