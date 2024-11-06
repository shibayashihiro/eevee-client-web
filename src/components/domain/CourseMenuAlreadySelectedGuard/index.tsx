import { useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { ModalDialog } from '@/components/ui/ModalDialog';
import { useFacilityId, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { eatInHome, initialHome } from '@/utils/paths/facilityPages';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useTableIdFromQuery } from '@/hooks/domain/useTableIdFromQuery';
import { isFacility } from '@/graphql/helper';
import { OrderType } from '@/graphql/generated/types';

import { useGetTableCourseMenusForAlreadySelectedGuardQuery } from './CourseMenuAlreadySelectedGuard.query.generated';
import { useCheckInTableWhenCourseMenuAlreadySelectedMutation } from './CourseMenuAlreadySelectedGuard.mutation.generated';

/**
 * Fragment化してクエリを他のComponentに任せる方法も考えられるが、
 * Guardとしての機能を優先して、このComponent自体がクエリを実行する。
 */
export const CourseMenuAlreadySelectedGuard = () => {
  const router = useTenantRouter();
  const facilityId = useFacilityId();
  const tableId = useTableIdFromQuery();

  const [{ data, fetching, error }] = useGetTableCourseMenusForAlreadySelectedGuardQuery({
    variables: {
      tableId,
      facilityId,
    },
    requestPolicy: 'network-only',
    pause: !tableId,
  });
  const [_, checkInTable] = useCheckInTableWhenCourseMenuAlreadySelectedMutation();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();
  const { isOpen, onOpen } = useDisclosure();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fetching) {
      return;
    }
    if (error) {
      handleErrorWithAlertDialog(error);
      return;
    }
    if (!data?.table || !data?.facility) {
      return;
    }
    if (data.table.mainCourseMenu !== null) {
      onOpen();
    }
  }, [data?.table, data?.facility, error, fetching, handleErrorWithAlertDialog, onOpen]);

  const onClick = async () => {
    if (!data?.table?.id) {
      return;
    }
    setLoading(true);
    const { error } = await checkInTable({
      input: {
        facilityId,
        tableId: data?.table?.id,
        customerAttributes: [],
      },
    });
    if (error) {
      handleErrorWithAlertDialog(error);
      setLoading(false);
      return;
    }

    if (!data || !data.facility || !isFacility(data.facility)) {
      throw new Error('not found');
    }
    if (data.facility.featureFlags.itemCodeSearchEnabled) {
      router.push(initialHome(facilityId, OrderType.EatIn));
    } else {
      router.push(eatInHome(facilityId));
    }
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      title="すでにコースが選択されています"
      onClose={() => {
        return;
      }}
      primaryAction={{
        text: 'ホーム',
        onClick,
        isLoading: loading,
      }}
    >
      ホームから商品を注文してください
    </ModalDialog>
  );
};
