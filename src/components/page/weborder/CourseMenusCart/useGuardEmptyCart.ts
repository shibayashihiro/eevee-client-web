import { useEffect, useState } from 'react';

import { useCourseMenusCart } from '@/providers/CourseMenusCartProvider';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { courseMenusPage } from '@/utils/paths/facilityPages';
import { useTableIdFromQuery } from '@/hooks/domain/useTableIdFromQuery';

/**
 * Cartが空の場合、コースメニュー一覧ページにリダイレクトする
 * @param facilityId
 */
export const useGuardEmptyCart = (facilityId: string) => {
  const [disabled, setDisabled] = useState(false);
  const tableId = useTableIdFromQuery();
  const state = useCourseMenusCart();
  const router = useTenantRouter();

  useEffect(() => {
    if (disabled) {
      return;
    }
    if (state.entryIds.length === 0) {
      router.push(courseMenusPage(facilityId, tableId));
    }
  }, [state.entryIds, router, facilityId, disabled, tableId]);

  return { disabled, setDisabled };
};
