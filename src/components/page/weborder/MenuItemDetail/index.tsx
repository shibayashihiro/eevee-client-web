import { ParsedUrlQuery } from 'querystring';
import { UrlObject } from 'url';

import React, { useMemo } from 'react';

import { Navbar } from '@/components/domain/Navbar';
import { OrderType } from '@/graphql/generated/types';
import { useFacilityId, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { MenuItemDetail } from '@/components/domain/MenuItemDetail';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { NextPageWithLayout } from '@/types';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { cartPage, tableOrderCartPage } from '@/utils/paths/facilityPages';
import { WithFeatureFlagsProvider } from '@/providers/FeatureFlagsProvider/WithFeatureFlagsProvider';

import { GetMenuItemDetailQuery, useGetMenuItemDetailQuery } from './MenuItemDetail.query.generated';

type ExpectedQuery = {
  id: string;
  orderItemId?: string;
  orderType: OrderType;
};

const validOrderTypes = [OrderType.EatIn, OrderType.Delivery, OrderType.Takeout];

const isValidQuery = (query: ParsedUrlQuery): query is ExpectedQuery => {
  if (typeof query.id !== 'string') {
    return false;
  }
  if (typeof query.orderType !== 'string' || !validOrderTypes.includes(query.orderType as OrderType)) {
    return false;
  }
  if (!!query.orderItemId && typeof query.orderItemId !== 'string') {
    return false;
  }
  return true;
};

const MenuItemDetailPage: NextPageWithLayout = () => {
  const facilityId = useFacilityId();

  const router = useTenantRouter();
  const queryParams = router.query;

  const valid = isValidQuery(queryParams);
  if (!valid) {
    throw new Error('menuItemDetail: invalid query');
  }

  const { id, orderType, orderItemId } = queryParams;

  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const [result] = useGetMenuItemDetailQuery({
    variables: {
      facilityID: facilityId,
      menuItemID: id,
      orderType: orderType,
      withOrderItem: !!orderItemId,
      isEatIn: orderType === OrderType.EatIn,
      orderItemID: orderItemId ?? '', // 本当はundefinedを渡したいが、GraphQLの都合上できなさそうなので空文字を渡す(withOrderItem=falseであれば使われない)
    },
    pause: id === undefined || typeof id !== 'string',
  });
  const { data, error, fetching } = result;
  useLoadingOverlay(fetching);

  const isTableOrder = !!data?.viewer.table;
  const backTo = useMemo(() => {
    if (orderType == OrderType.EatIn && isTableOrder) {
      return tableOrderCartPage(facilityId);
    }
    return cartPage(facilityId, orderType);
  }, [facilityId, isTableOrder, orderType]);

  if (error) {
    handleErrorWithAlertDialog(error);
  }

  return <>{data && <MenuItemDetailPageLayout data={data} orderType={orderType} backTo={backTo} />}</>;
};

const MenuItemDetailPageLayout = ({
  data,
  orderType,
  backTo,
}: {
  data: GetMenuItemDetailQuery;
  orderType: OrderType;
  backTo: UrlObject;
}) => {
  const { menuItem, tenant, viewer, facility } = data;

  if (facility?.__typename !== 'Facility') {
    throw new Error('facility type error');
  }
  if (menuItem?.__typename !== 'MenuItem') {
    throw new Error('menuItem type error');
  }

  return (
    <>
      <Navbar viewing={tenant} viewer={viewer} facility={facility} orderType={orderType} />
      <WithFeatureFlagsProvider facility={facility}>
        <MenuItemDetail
          menuItem={menuItem}
          cartId={viewer.cart.id}
          orderType={orderType as OrderType}
          hasDeliveryAddress={viewer.deliveryAddresses.length > 0}
          initialOrderItem={viewer.cart.item}
          backTo={backTo}
        />
      </WithFeatureFlagsProvider>
    </>
  );
};

export default MenuItemDetailPage;
