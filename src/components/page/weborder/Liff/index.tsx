import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';

import { NextPageWithLayout } from '@/types';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import {
  courseMenusPage,
  deliveryHome,
  eatInHome,
  myPageHome,
  myPageCoupon,
  tableCheckInPage,
  takeoutHome,
  myPageStampCard,
  orderPage,
} from '@/utils/paths/facilityPages';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { isFacility } from '@/graphql/helper';
import { debugPage, home, linkOrderPage, subscriptionHomePage } from '@/utils/paths/tenantPages';

import { useCheckInTableFromLineMutation } from './LiffRedirect.mutation.generated';
import { useGetCourseMenuFeatureFlagForLiffInitQuery, useGetTableForLiffInitQuery } from './Liff.query.generated';
import { handleDestination } from './destination';

// LiffPage ページは, LIFFアプリのリダイレクト先として機能する.
// LIFFアプリのリダイレクト先は, LINE DevelopersコンソールのエンドポイントURLとして設定され, ユーザーが
// LIFF URL ( https://liff.line.me/${liff_id} ) にアクセスすると, LIFFサーバーから自動的にリダイレクトされる.
// ref: https://developers.line.biz/ja/docs/liff/opening-liff-app/#redirect-flow
//
// NOTE:
// 以前は `env` 変数を利用して、1 Tenant Identifier内で複数のLINEミニアプリ環境を分けていたが
// 現在はその方式をやめている。liff専用のエンドポイントURLである `/liff` のRoute(=このComponentの呼び出し元)も今後は不要にできる。
// （ただ既存のLINEミニアプリのエンドポイント設定を全て変更しなければならないため、すぐに削除は難しい。
export const LiffPage: NextPageWithLayout = () => {
  return <LIFFEndpointController />;
};

const LIFFEndpointController = () => {
  const router = useTenantRouter();
  const [__, checkInTable] = useCheckInTableFromLineMutation();

  const { table, fetching: tableFetching } = useTableFromQuery();
  const { courseMenuModeEnabled, fetching: courseMenuModeEnabledFetching } = useCourseMenuModeEnabledFromQuery();

  const fetching = tableFetching || courseMenuModeEnabledFetching;

  const goToEatInHomeWithCheckIn = useCallback(
    async (facilityId: string, tableId: string) => {
      const { error } = await checkInTable({
        input: {
          facilityId,
          tableId,
          // この画面でcheckInするのは、すでにテーブルがチェックイン済みのケースのみなので、
          // ここのcustomerAttributesは常に空で良い
          customerAttributes: [],
        },
      });
      if (error) {
        // ここでエラーが起きてもどうしようもない（戻り先が決まらない）ので
        // エラーをthrowして予期せぬエラー扱いにする
        throw error;
      }
      router.replace(eatInHome(facilityId));
    },
    [checkInTable, router],
  );

  const handleRedirect = useCallback(async () => {
    const destination = handleDestination({
      queryParams: router.query,
      courseMenuModeEnabled: courseMenuModeEnabled ?? false,
      alreadyCourseMenuSelected: table?.mainCourseMenu !== null,
      isCustomerAttributesCollected: table?.isCustomerAttributesCollected ?? false,
    });
    switch (destination.type) {
      case 'debug':
        return router.replace(debugPage);
      case 'linkOrder':
        return router.replace(linkOrderPage(destination.linkOrderId));
      case 'mypage':
        return router.replace(myPageHome(destination.facilityId));
      case 'myStampCard':
        return router.replace(myPageStampCard(destination.facilityId));
      case 'myCoupon':
        return router.replace(myPageCoupon(destination.facilityId));
      case 'subscription':
        return router.replace(subscriptionHomePage);
      case 'home':
        return router.replace(home);
      case 'deliveryHome':
        return router.replace(deliveryHome(destination.facilityId));
      case 'eatInHome':
        return router.replace(eatInHome(destination.facilityId));
      case 'takeoutHome':
        return router.replace(takeoutHome(destination.facilityId));
      case 'courseMenus':
        if (!table) {
          throw new Error('internal error when redirecting to courseMenus');
        }
        return router.replace(courseMenusPage(destination.facilityId, table.id));
      case 'startCheckIn':
        if (!table) {
          throw new Error('internal error when redirecting to startCheckIn');
        }
        return router.replace(tableCheckInPage(destination.facilityId, table.id));
      case 'checkedIn':
        if (!table) {
          throw new Error('internal error when redirecting to checkedIn');
        }
        return goToEatInHomeWithCheckIn(destination.facilityId, table.id);
      case 'order':
        return router.replace(orderPage(destination.facilityId, destination.orderId));
    }
  }, [courseMenuModeEnabled, goToEatInHomeWithCheckIn, router, table]);

  /**
   * main処理
   */
  useEffect(() => {
    if (!router.isReady || fetching) {
      return;
    }
    handleRedirect();
  }, [fetching, handleRedirect, router]);

  return <LoadingSpinner />;
};

const useTableFromQuery = () => {
  const { query } = useRouter();
  const [{ data, fetching, error }] = useGetTableForLiffInitQuery({
    variables: {
      tableId: query.tableId as string,
    },
    pause: typeof query.tableId !== 'string',
  });

  if (error) {
    throw error;
  }

  return {
    table: data?.table,
    fetching,
  };
};

const useCourseMenuModeEnabledFromQuery = () => {
  const { query } = useRouter();
  const [{ data, fetching, error }] = useGetCourseMenuFeatureFlagForLiffInitQuery({
    variables: {
      facilityId: query.facilityId as string,
    },
    pause: typeof query.facilityId !== 'string',
  });

  if (error) {
    throw error;
  }
  const courseMenuModeEnabled =
    data?.facility && isFacility(data.facility) && data.facility.featureFlags?.eatInCourseMenuModeEnabled;

  return {
    courseMenuModeEnabled,
    fetching,
  };
};
