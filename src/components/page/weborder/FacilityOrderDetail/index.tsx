import { VStack } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';

import { NextPageWithLayout } from '@/types';
import { getOrderType, isDeliveryOrder, isFacility, isTakeoutOrder, isTenant } from '@/graphql/helper';
import { NotFoundError } from '@/utils/errors';
import { OrderDetail } from '@/components/domain/OrderDetail';
import { containerMarginX } from '@/utils/constants';
import { OrderCompleted } from '@/components/domain/OrderCompleted';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { DeliveryOrderProgressDetail } from '@/components/domain/DeliveryOrderProgressDetail';
import { TakeoutOrderProgressDetail } from '@/components/domain/TakeoutOrderProgressDetail';
import { NavigationHeaderLayout } from '@/components/layouts/NavigationHeaderLayout';

import { useGetFacilityOrderDetailQuery } from './FacilityOrderDetail.query.generated';

/**
 * FacilityOrderDetailPage は、店舗(Facility)配下の注文詳細画面を表示するページ。
 * 元々、店舗単位で注文詳細画面が存在していたが、中規模ブランド向けの機能追加で
 * ブランド(Tenant)単位で注文詳細画面を表示するようになったため、今のように分かれた。
 * 将来的には中身のComponentは統一して良いかもしれない。
 */
const FacilityOrderDetailPage: NextPageWithLayout = () => {
  const router = useTenantRouter();
  const { id, facilityId } = router.query;

  const [result, reexecuteQuery] = useGetFacilityOrderDetailQuery({
    variables: {
      orderID: id as string,
      facilityID: facilityId as string,
    },
  });

  const polling: boolean = useMemo(() => {
    const order = result?.data?.order;
    if (!order) {
      return false;
    }
    return (isDeliveryOrder(order) || isTakeoutOrder(order)) && order.progress != null;
  }, [result?.data?.order]);

  useEffect(() => {
    // 10秒間隔で更新する
    const timerId = setInterval(() => {
      if (polling) {
        reexecuteQuery({ requestPolicy: 'network-only' });
      }
    }, 10000);
    return () => clearInterval(timerId);
  }, [polling, reexecuteQuery]);

  const { data, fetching, error } = result;
  useLoadingOverlay(fetching);
  if (error) {
    throw error;
  }

  const { tenant, facility, order } = data ?? {};
  if (!fetching && (!data || !tenant || !order)) {
    throw new NotFoundError();
  }

  return (
    <>
      {data &&
        tenant &&
        isTenant(tenant) &&
        facility &&
        isFacility(facility) &&
        order &&
        (isDeliveryOrder(order) || isTakeoutOrder(order)) && (
          <>
            <NavigationHeaderLayout
              viewing={tenant}
              viewer={data.viewer}
              orderType={getOrderType(order)}
              facility={facility}
            >
              <>
                {!order.progress && <OrderCompleted orderedItems={order.items} orderType={getOrderType(order)} />}

                {isDeliveryOrder(order) && order.progress && (
                  <VStack mx={containerMarginX} align="left" spacing={0}>
                    <DeliveryOrderProgressDetail fragment={order.progress} />
                    <OrderDetail fragment={order} showShortIds={true} />
                  </VStack>
                )}

                {isTakeoutOrder(order) && order.progress && (
                  <VStack mx={containerMarginX} align="left" spacing={0}>
                    <TakeoutOrderProgressDetail
                      fragment={order.progress}
                      orderId={id as string}
                      shortIds={order.shortIds}
                    />
                    <OrderDetail fragment={order} showFacilityLocationMap={true} />
                  </VStack>
                )}
              </>
            </NavigationHeaderLayout>
          </>
        )}
    </>
  );
};

export default FacilityOrderDetailPage;
