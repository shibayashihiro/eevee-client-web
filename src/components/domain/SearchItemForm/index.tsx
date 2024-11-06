import { ParsedUrlQuery } from 'querystring';

import { FormControl } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useClient } from 'urql';

import { PrimaryButton } from '@/components/ui/Button';
import { BasicInput } from '@/components/ui/Input';
import { OrderType } from '@/graphql/generated/types';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useFacilityId, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { replaceToNumerics } from '@/utils/formatUtils';
import { menuItemDetailPage } from '@/utils/paths/facilityPages';

import {
  GetMenuItemByItemCodeDocument,
  GetMenuItemByItemCodeQuery,
  GetMenuItemByItemCodeQueryVariables,
} from './SearchItemForm.query.generated';

type ExpectedQuery = {
  orderType: OrderType;
};

const isValidQuery = (query: ParsedUrlQuery): query is ExpectedQuery => {
  return (
    query.orderType == OrderType.EatIn || query.orderType == OrderType.Delivery || query.orderType == OrderType.Takeout
  );
};

export const SearchItemForm = () => {
  const router = useTenantRouter();
  const { ...queryParams } = router.query;
  const valid = isValidQuery(queryParams);
  if (!valid) {
    throw new Error('searchItemForm: invalid query');
  }
  const { orderType } = queryParams;
  const facilityId = useFacilityId();
  const [itemCode, setCode] = useState('');
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();
  const [isLoading, setIsLoading] = useState(false);
  const submitButtonEnabled = itemCode.length > 0;
  const gqlClient = useClient();
  const handleChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = replaceToNumerics(e.target.value);

    setCode(parsedValue);
  };

  const handleSubmit = useCallback(async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    const { data, error } = await gqlClient.query<GetMenuItemByItemCodeQuery, GetMenuItemByItemCodeQueryVariables>(
      GetMenuItemByItemCodeDocument,
      {
        facilityId: facilityId,
        itemCode: itemCode,
        orderType: orderType,
      },
    );
    try {
      if (error) {
        return handleErrorWithAlertDialog(error);
      }
      if (!data || data?.menuItem?.__typename !== 'MenuItem') {
        return;
      }
      const menuItemId = data.menuItem.id;
      router.push(menuItemDetailPage(facilityId, menuItemId, orderType));
    } finally {
      setIsLoading(false);
    }
  }, [gqlClient, handleErrorWithAlertDialog, isLoading, itemCode, facilityId, orderType, router]);

  return (
    <>
      <FormControl pt="16px" pb="20px">
        <BasicInput
          id="number"
          type="number"
          h="80px"
          name="number"
          borderRadius="4px"
          fontSize="40px"
          fontWeight="bold"
          textAlign="center"
          value={itemCode}
          onChange={handleChangeCode}
        />
      </FormControl>
      <PrimaryButton onClick={handleSubmit} h="56px" disabled={!submitButtonEnabled} isLoading={isLoading}>
        商品を確認する
      </PrimaryButton>
    </>
  );
};
