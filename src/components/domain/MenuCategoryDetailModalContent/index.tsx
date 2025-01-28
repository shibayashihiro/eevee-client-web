import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Text, VStack, HStack, Divider, ListItem, Image, OrderedList } from '@chakra-ui/react';
import { useClient } from 'urql';
import { captureException } from '@sentry/nextjs';

import { containerMarginX } from '@/utils/constants';
import { OrderType, ScheduledOrderTime } from '@/graphql/generated/types';
import { isFacility, isMenuCategory, useAdditionalTypeNamesContext } from '@/graphql/helper';
import {
  GetMoreMenuCategoryItemsDocument,
  GetMoreMenuCategoryItemsQuery,
  GetMoreMenuCategoryItemsQueryVariables,
  useGetMenuCategoryQuery,
} from '@/components/domain/MenuCategoryDetailModalContent/MenuCategoryDetailModalContent.query.generated';
import { localizedMessages } from '@/utils/errors';
import { safeImage } from '@/utils/image';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { NoImage } from '@/components/ui/NoImage';
import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { CarouselItemPrice } from '@/components/domain/MenuCategoryCarousel/CarouselItemPrice';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { InfiniteScroll } from '@/components/ui/InfiniteScroll';
import { SwipeableBottomModal } from '@/components/ui/SwipeableBottomModalDialog';

import { MenuItemDetailModalContent } from '../MenuItemDetailMoalContent';

import { MenuCategoryItemsFragment } from './MenuCategoryDetail.fragment.generated';

type Props = {
  categoryId: string;
  orderType: OrderType;
  closeCategoryModal?: () => void;
};

export const MenuCategoryDetailModalContent: FC<Props> = ({ categoryId, orderType, closeCategoryModal }: Props) => {
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const facilityId = useFacilityId();

  const context = useAdditionalTypeNamesContext<[ScheduledOrderTime]>(['ScheduledOrderTime']);
  const [result] = useGetMenuCategoryQuery({
    variables: {
      facilityId: facilityId,
      menuCategoryID: categoryId,
      orderType: orderType,
      after: null, // 初期表示時は常にnull
    },
    context,
    pause: categoryId === undefined || typeof categoryId !== 'string',
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
      {data && data.facility && isFacility(data.facility) && menuCategory && isMenuCategory(menuCategory) && (
        <MenuCategoryItemsList
          category={menuCategory}
          showPriceExcludingTax={showPriceExcludingTax}
          orderType={orderType}
          closeCategoryModal={closeCategoryModal}
        />
      )}
    </>
  );
};

const MenuCategoryItemsList = ({
  category,
  showPriceExcludingTax,
  orderType,
  closeCategoryModal
}: {
  category: MenuCategoryItemsFragment;
  showPriceExcludingTax: boolean;
  orderType: OrderType;
  closeCategoryModal?: () => void;
}) => {
  const { nodes: initialItems, pageInfo: initialPageInfo } = category.items;
  const [pageInfo, setPageInfo] = useState<MenuCategoryItemsFragment['items']['pageInfo']>(initialPageInfo);
  const [moreItems, setMoreItems] = useState<MenuCategoryItemsFragment['items']['nodes']>([]);
  const [lastFetchedCursor, setLastFetchedCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuCategoryItemsFragment['items']['nodes'][0] | null>(null);  

  const gqlClient = useClient();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const openModal = useCallback((menuItem: MenuCategoryItemsFragment['items']['nodes'][0]) => {
    setSelectedItem(menuItem);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedItem(null);
  }, []);

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
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = ''; // クリーンアップ
    };
  }, [isModalOpen]);
  return (
    <>
      <OrderedList styleType="none" ml={containerMarginX}>
        <InfiniteScroll hasMore={!isLoading && pageInfo.hasNextPage} loadMore={loadMore} loader={<LoadingSpinner />}>
          {items.map((menuItem, i) => (
            <ListItem pt="16px" key={i}>
              <HStack
                onClick={() => openModal(menuItem)}
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
                  <Image
                    src={safeImage(menuItem.image)}
                    alt={menuItem.name}
                    boxSize="80px"
                    fallback={<NoImage rounded="4px" boxSize="80px" />}
                    rounded="4px"
                    objectFit="cover"                    
                  />
                </Box>
              </HStack>
              <Divider mt="16px" />
            </ListItem>
          ))}
        </InfiniteScroll>
      </OrderedList>
      <SwipeableBottomModal isOpen={isModalOpen} onClose={closeModal} title={selectedItem?.name || ''} footer={null}>
        {selectedItem && (
          <MenuItemDetailModalContent menuItemId={selectedItem.id} orderType={orderType} closeModal={closeModal} closeCategoryModal={closeCategoryModal} />
        )}
      </SwipeableBottomModal>
    </>
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
