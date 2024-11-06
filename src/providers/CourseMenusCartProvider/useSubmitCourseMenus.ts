import { useCallback, useState } from 'react';

import { eatInHome, initialHome } from '@/utils/paths/facilityPages';
import { OrderType, SubmitCourseMenusItemInput } from '@/graphql/generated/types';

import { useHandleErrorWithAlertDialog, useShowGlobalModalDialog } from '../tenant/GlobalModalDialogProvider/hooks';
import { useTenantRouter } from '../tenant/WebOrderPageStateProvider';
import { useFeatureFlags } from '../FeatureFlagsProvider';

import { useSubmitCourseMenusMutation } from './useSubmitCourseMenus.mutation.generated';

import { useCourseMenusCartDispatch } from '.';

type Props = {
  facilityId: string;
  tableId: string;
};

// コースメニューのカート内容を送信する処理を共通利用できるよう提供する。
export const useSubmitCourseMenus = ({ facilityId, tableId }: Props) => {
  const { showGlobalModalDialog } = useShowGlobalModalDialog();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const router = useTenantRouter();

  const dispatch = useCourseMenusCartDispatch();
  const [_, submitCourseMenusMutation] = useSubmitCourseMenusMutation();

  const [loading, setLoading] = useState(false);
  const { itemCodeSearchEnabled } = useFeatureFlags();

  const submitCourseMenus = useCallback(
    async (items: SubmitCourseMenusItemInput[]) => {
      setLoading(true);
      try {
        if (items.length === 0) {
          throw new Error('カートに商品が入っていません');
        }
        const { data, error } = await submitCourseMenusMutation({
          input: {
            facilityId,
            tableId,
            items: items.map(({ courseMenuId, courseMenuEntryId, quantity }) => ({
              // 万が一不要なフィールドが混ざっているとスキーマエラーになるため、明示的にinputを作り直す
              courseMenuId,
              courseMenuEntryId,
              quantity,
            })),
          },
        });
        if (error) {
          handleErrorWithAlertDialog(error);
          return;
        }

        await router.push(itemCodeSearchEnabled ? initialHome(facilityId, OrderType.EatIn) : eatInHome(facilityId));
        dispatch({ type: 'CLEAR_CART' });
        if (data?.submitCourseMenus?.postOrderMessage) {
          const { title, message } = data.submitCourseMenus.postOrderMessage;
          showGlobalModalDialog(title, message);
        }
      } finally {
        setLoading(false);
      }
    },
    [
      dispatch,
      facilityId,
      handleErrorWithAlertDialog,
      router,
      showGlobalModalDialog,
      submitCourseMenusMutation,
      tableId,
      itemCodeSearchEnabled, // 依存関係に追加
    ],
  );

  return {
    loading,
    submitCourseMenus,
  };
};
