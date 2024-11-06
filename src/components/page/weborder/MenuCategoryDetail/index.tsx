import { ParsedUrlQuery } from 'querystring';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Text, VStack, HStack, Divider, ListItem, OrderedList } from '@chakra-ui/react';
import { useClient } from 'urql';
import { captureException } from '@sentry/nextjs';

import { containerMarginX } from '@/utils/constants';
import { OrderType, ScheduledOrderTime } from '@/graphql/generated/types';
import { isFacility, isMenuCategory, useAdditionalTypeNamesContext } from '@/graphql/helper';
import { Navbar } from '@/components/domain/Navbar';
import {
  GetMoreMenuCategoryItemsDocument,
  GetMoreMenuCategoryItemsQuery,
  GetMoreMenuCategoryItemsQueryVariables,
  useGetMenuCategoryQuery,
} from '@/components/page/weborder/MenuCategoryDetail/MenuCategoryDetail.query.generated';
import { localizedMessages } from '@/utils/errors';
import { menuItemDetailPage } from '@/utils/paths/facilityPages';
import { NextPageWithLayout } from '@/types';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { MenuItemImage } from '@/components/ui/MenuItemImage';
import { useFacilityId, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { CarouselItemPrice } from '@/components/domain/MenuCategoryCarousel/CarouselItemPrice';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { InfiniteScroll } from '@/components/ui/InfiniteScroll';

import { MenuCategoryItemsFragment } from './MenuCategoryDetail.fragment.generated';

type ExpectedQuery = {
  orderType: OrderType;
};

const isValidQuery = (query: ParsedUrlQuery): query is ExpectedQuery => {
  if (
    query.orderType !== OrderType.EatIn &&
    query.orderType !== OrderType.Delivery &&
    query.orderType !== OrderType.Takeout
  ) {
    return false;
  }
  return true;
};

const MenuCategoryDetail: NextPageWithLayout = () => {
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const router = useTenantRouter();
  const facilityId = useFacilityId();
  const { id, ...queryParams } = router.query;

  const valid = isValidQuery(queryParams);
  if (!valid) {
    throw new Error('menuCategoryDetail: invalid query');
  }

  const { orderType } = queryParams;

  const context = useAdditionalTypeNamesContext<[ScheduledOrderTime]>(['ScheduledOrderTime']);
  const [result] = useGetMenuCategoryQuery({
    variables: {
      facilityId: facilityId,
      menuCategoryID: id as string,
      orderType: orderType,
      after: null, // 初期表示時は常にnull
    },
    context,
    pause: id === undefined || typeof id !== 'string',
  });

  const { data, fetching, error } = result;
  if (error) {
    handleErrorWithAlertDialog(error);
  }
  if (fetching) {
    return <LoadingSpinner />;
  }
  if (!fetching && !data) {
    handleErrorWithAlertDialog(new Error(localizedMessages.NotFoundError));
  }

  const menuCategory = data?.menuCategory;

  // このComponentはまだFeatureFlagsProviderの子孫ではないため、useFeatureFlagsを使わずに直接facilityから参照する
  const showPriceExcludingTax =
    (data?.facility && isFacility(data.facility) && data.facility.featureFlags.showPriceExcludingTax) ?? false;

  return (
    <>
      {data && data.facility && isFacility(data.facility) && (
        <Navbar viewing={data.viewing} viewer={data.viewer} facility={data.facility} orderType={orderType} />
      )}
      {menuCategory && isMenuCategory(menuCategory) && (
        <Box py="40px">
          <VStack ml={containerMarginX} align="left">
            <Text mr="20px" className="bold-large">
              {menuCategory.name}
            </Text>
            <Divider pt="32px" />
          </VStack>
          <MenuCategoryItemsList
            category={menuCategory}
            showPriceExcludingTax={showPriceExcludingTax}
            orderType={orderType}
          />
        </Box>
      )}
    </>
  );
};

const MenuCategoryItemsList = ({
  category,
  showPriceExcludingTax,
  orderType,
}: {
  category: MenuCategoryItemsFragment;
  showPriceExcludingTax: boolean;
  orderType: OrderType;
}) => {
  const { nodes: initialItems, pageInfo: initialPageInfo } = category.items;
  const [pageInfo, setPageInfo] = useState<MenuCategoryItemsFragment['items']['pageInfo']>(initialPageInfo);
  const [moreItems, setMoreItems] = useState<MenuCategoryItemsFragment['items']['nodes']>([]);
  const [lastFetchedCursor, setLastFetchedCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useTenantRouter();
  const facilityId = useFacilityId();

  const gqlClient = useClient();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const geneHandleClickMenuItem = useCallback(
    (menuItemId: string) => {
      return (e: React.MouseEvent) => {
        e.preventDefault();
        router.push(menuItemDetailPage(facilityId, menuItemId, orderType));
      };
    },
    [facilityId, orderType, router],
  );

  const { endCursor: nextCursor } = pageInfo;
  const loadMore = useCallback(async () => {
    if (isLoading || !nextCursor || lastFetchedCursor === nextCursor) {
      return;
    }
    setIsLoading(true);
    const { data, error } = await gqlClient.query<
      GetMoreMenuCategoryItemsQuery,
      GetMoreMenuCategoryItemsQueryVariables
    >(GetMoreMenuCategoryItemsDocument, {
      menuCategoryID: category.id,
      orderType: orderType,
      after: nextCursor,
    });
    try {
      if (error) {
        return handleErrorWithAlertDialog(error);
      }
      if (!data || data?.menuCategory?.__typename !== 'MenuCategory') {
        return;
      }
      const { nodes, pageInfo: newPageInfo } = data.menuCategory.items;
      setLastFetchedCursor(nextCursor ?? null);
      setPageInfo(newPageInfo);
      setMoreItems((prev) => [...prev, ...nodes]);
    } finally {
      setIsLoading(false);
    }
  }, [category.id, gqlClient, handleErrorWithAlertDialog, isLoading, lastFetchedCursor, nextCursor, orderType]);

  const items = useMemo(() => [...initialItems, ...moreItems], [initialItems, moreItems]);
  useEffect(() => {
    sendMenuItemSimpleMissingErrReport(category.id, items);
    sendMenuItemMissingErrReport(items);
  }, [category.id, items]);
  return (
    <OrderedList styleType="none" ml={containerMarginX}>
      <InfiniteScroll hasMore={!isLoading && pageInfo.hasNextPage} loadMore={loadMore} loader={<LoadingSpinner />}>
        {items.map((menuItem, i) => (
          <ListItem pt="16px" key={i}>
            <HStack
              onClick={geneHandleClickMenuItem(menuItem.id)}
              _hover={{ cursor: 'pointer' }}
              mr={containerMarginX}
              justify="space-between"
            >
              <VStack align="left">
                <Text className="bold-small">{menuItem.name}</Text>
                <Text className="text-extra-small">{menuItem.description}</Text>
                {/* NOTE: ここでCarouselItemPriceを使うのは少し違和感あるので直したい */}
                <CarouselItemPrice
                  price={menuItem.price}
                  priceExcludingTax={showPriceExcludingTax ? menuItem.priceExcludingTax : undefined}
                  unavailableReason={menuItem.status.available ? null : menuItem.status.labelUnavailable}
                />
              </VStack>
              <Box w="80px" flexShrink={0}>
                <MenuItemImage
                  href={menuItemDetailPage(facilityId, menuItem.id, orderType)}
                  image={menuItem.image || undefined}
                  name={menuItem.name}
                  boxSize="80px"
                />
              </Box>
            </HStack>
            <Divider mt="16px" />
          </ListItem>
        ))}
      </InfiniteScroll>
    </OrderedList>
  );
};

type MenuItemMissingErr = {
  errItemId: string;
  errItemName: string;
  nextItemId: string;
};

const defectErrItems: MenuItemMissingErr[] = [
  {
    errItemId: 'TWVudUl0ZW06eDZFM1JhRUxZTk9qV3V3bno4UVQvb0RjdWNrb0ZpemRkU3dRMXd4QXo=',
    errItemName: 'さつまいものフリット メープル＆バター添え',
    nextItemId: 'TWVudUl0ZW06eDZFM1JhRUxZTk9qV3V3bno4UVQvbFFoaHpNRWN0WkJUWWpOd3hWOFk=', // 海老のアヒージョ
  },
] as const;
const defectErrItemByNextItemId = defectErrItems.reduce<Record<string, MenuItemMissingErr>>((acc, item) => {
  acc[item.nextItemId] = item;
  return acc;
}, {});

// PISOLAさまで商品が抜け落ちるケースが発生しているが、再現性が不明のため
// 愚直な書き方でエラーをキャプチャする関数。
// TODO: 原因が特定でき次第この関数は削除する。
function sendMenuItemMissingErrReport(items: MenuCategoryItemsFragment['items']['nodes']) {
  items.forEach((item, i) => {
    const itm = defectErrItemByNextItemId[item.id];
    if (!itm) {
      return;
    }
    const targetItem = items[i - 1];
    if (targetItem && targetItem.id === itm.errItemId) {
      return;
    }
    const errMessage = `[MenuItem]${itm.errItemName}の欠損が発生しました。`;
    captureException(new Error(errMessage), {
      extra: {
        actualItemId: targetItem?.id,
        targetItemId: itm.errItemId,
        nextItemId: itm.nextItemId,
      },
    });
  });
}

// 歯抜けではなくシンプルに商品が表示されないケースがあったためそのエラーも送信するため定義
type MenuItemSimpleMissingErr = {
  categoryId: string;
  errItemId: string;
  errItemName: string;
};
const simpleMissingErrItems: MenuItemSimpleMissingErr[] = [
  {
    categoryId: 'TWVudUNhdGVnb3J5Ong2RTNSYUVMWU5Pald1d256OFFUL3d3aDVIcVlHaHNxclM2TEhCOVh2',
    errItemId: 'TWVudUl0ZW06eDZFM1JhRUxZTk9qV3V3bno4UVQvYVpCR0pwd0tJMXViTG9paVpQenU=',
    errItemName: 'メロンアイス',
  },
  {
    categoryId: 'TWVudUNhdGVnb3J5Ong2RTNSYUVMWU5Pald1d256OFFUL3d3aDVIcVlHaHNxclM2TEhCOVh2',
    errItemId: 'TWVudUl0ZW06eDZFM1JhRUxZTk9qV3V3bno4UVQvdXE4MGo0QlAyQUtEbzVlOVROYUQ=',
    errItemName: 'スパークリングワインゼリーとフレッシュメロンパフェ',
  },
] as const;

function sendMenuItemSimpleMissingErrReport(categoryId: string, items: MenuCategoryItemsFragment['items']['nodes']) {
  simpleMissingErrItems.forEach((item) => {
    if (categoryId !== item.categoryId) {
      return;
    }
    if (items.some((i) => i.id === item.errItemId)) {
      // 商品が存在する場合はエラーを送信しない
      return;
    }
    const errMessage = `[MenuItem]${item.errItemName}の欠損が発生しました。`;
    captureException(new Error(errMessage), {
      extra: {
        categoryId: item.categoryId,
        targetItemId: item.errItemId,
      },
    });
  });
}

export default MenuCategoryDetail;
