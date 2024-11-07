import { useDisclosure, HStack, Text, VStack } from '@chakra-ui/react';
import { useMemo, useCallback, useState, useEffect } from 'react';

import { NoticeReadStatus, UserCourseMenuNoticeStatus } from '@/graphql/generated/types';
import { getMinutesDiff } from '@/utils/date';
import { ModalDialog } from '@/components/ui/ModalDialog';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';

import { TableCourseMenuForTimerFragment } from './LastOrderTimer.fragment.generated';
import { useUpdateUserCourseMenuNoticeStatusMutation } from './LastOrderTimer.mutation.generated';

type Props = {
  courseMenu: TableCourseMenuForTimerFragment;
};

export const LastOrderTimer = ({ courseMenu }: Props) => {
  const {
    lastOrderAt,
    noticeReadStatus,
    courseMenu: { category },
  } = courseMenu;

  const lastOrderAtDate = useMemo(() => (lastOrderAt ? new Date(lastOrderAt) : new Date()), [lastOrderAt]);
  const calculateMinutesLeft = useCallback(() => getMinutesDiff(new Date(), lastOrderAtDate), [lastOrderAtDate]);

  const [minutesLeft, setMinutesLeft] = useState<number>(calculateMinutesLeft);
  const lastOrderPassedNotice = useDisclosure();

  const shouldShowLastOrderPassedNotice = useMemo(() => {
    return minutesLeft <= 0 && noticeReadStatus != NoticeReadStatus.TimeOverRead;
  }, [minutesLeft, noticeReadStatus]);

  const shouldShowLastTenMinutesNotice = useMemo(() => {
    if (shouldShowLastOrderPassedNotice) {
      return false;
    }
    return minutesLeft <= 10 && noticeReadStatus === NoticeReadStatus.NothingRead;
  }, [minutesLeft, noticeReadStatus, shouldShowLastOrderPassedNotice]);

  useEffect(() => {
    const timerAction = (timerId?: NodeJS.Timeout) => {
      const minutesLeft = calculateMinutesLeft();
      setMinutesLeft(minutesLeft);
      if (shouldShowLastOrderPassedNotice) {
        if (timerId) {
          clearInterval(timerId);
        }
      }
    };

    timerAction(); // 初回実行

    const timerId = setInterval(() => {
      timerAction(timerId);
    }, 1000 * 60);
    return () => clearInterval(timerId);
  }, [
    calculateMinutesLeft,
    lastOrderAtDate,
    lastOrderPassedNotice,
    shouldShowLastOrderPassedNotice,
    shouldShowLastTenMinutesNotice,
  ]);

  if (!lastOrderAt) {
    return null;
  }

  return (
    <>
      {minutesLeft >= 0 && (
        <HStack justify="space-between" bg="white" p="2px 8px" borderRadius="4px">
          <Text className="bold-small">ラストオーダーまで残り</Text>
          <Text className="bold-small" color="brand.primary">
            <Text as="span" className="bold-3xl">
              {minutesLeft}
            </Text>
            分
          </Text>
        </HStack>
      )}

      <LastTenMinutesNoticeDialog minutesLeft={minutesLeft} isOpen={shouldShowLastTenMinutesNotice} />
      <LastOrderPassedNoticeDialog
        courseMenuCategoryName={category?.name ?? ''}
        isOpen={shouldShowLastOrderPassedNotice}
      />
    </>
  );
};

const LastTenMinutesNoticeDialog = ({ minutesLeft, isOpen }: { minutesLeft: number; isOpen: boolean }) => {
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();
  const [{ fetching }, updateCourseMenuNoticeStatus] = useUpdateUserCourseMenuNoticeStatusMutation();
  const handleOnClick = async () => {
    const { error } = await updateCourseMenuNoticeStatus({
      input: {
        status: UserCourseMenuNoticeStatus.Read_10MinutesNotice,
      },
    });
    if (error) {
      handleErrorWithAlertDialog(error);
    }
  };
  return (
    <ModalDialog
      isOpen={isOpen}
      secondaryAction={{
        text: 'OK',
        onClick: handleOnClick,
        isLoading: fetching,
      }}
      onClose={() => {
        return;
      }}
    >
      <VStack align="stretch" alignItems="center" spacing="8px">
        <Text className="bold-large">ラストオーダーまで</Text>
        <Text className="bold-large">
          残り
          <Text as="span" fontSize="54px" color="brand.primary">
            {minutesLeft}
          </Text>
          分
        </Text>
      </VStack>
      <Text className="text-small" mt="16px" w="full" textAlign="center">
        追加のご注文がある場合はお急ぎください
      </Text>
    </ModalDialog>
  );
};

const LastOrderPassedNoticeDialog = ({
  courseMenuCategoryName,
  isOpen,
}: {
  courseMenuCategoryName: string;
  isOpen: boolean;
}) => {
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();
  const [{ fetching }, updateCourseMenuNoticeStatus] = useUpdateUserCourseMenuNoticeStatusMutation();
  const handleOnClick = async () => {
    const { error } = await updateCourseMenuNoticeStatus({
      input: {
        status: UserCourseMenuNoticeStatus.ReadEndNotice,
      },
    });
    if (error) {
      handleErrorWithAlertDialog(error);
    }
  };
  return (
    <ModalDialog
      title={`${courseMenuCategoryName}が終了しました`}
      isOpen={isOpen}
      secondaryAction={{
        text: 'OK',
        onClick: handleOnClick,
        isLoading: fetching,
      }}
      onClose={() => {
        return;
      }}
    >
      <></>
    </ModalDialog>
  );
};
