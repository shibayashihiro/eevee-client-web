import { useDisclosure, HStack, Text, VStack } from '@chakra-ui/react';
import { useMemo, useCallback, useState, useEffect } from 'react';

import { NoticeReadStatus, UserCourseMenuNoticeStatus } from '@/graphql/generated/types';
import { getMinutesDiff } from '@/utils/date';
import { ModalDialog } from '@/components/ui/ModalDialog';

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

  // 「既読」の状態をClient側でただちに更新させるために、props(apiの結果を直参照)ではなくstateで保持する。
  // ダイアログでOKをクリックしたときに、APIの結果を待たずに既読したことにしたいため。
  const [alreadyReadTenMinutesNotice, setAlreadyReadTenMinutesNotice] = useState<boolean>(
    noticeReadStatus !== NoticeReadStatus.NothingRead,
  );
  const [alreadyReadLastOrderPassedNotice, setAlreadyReadLastOrderPassedNotice] = useState<boolean>(
    noticeReadStatus === NoticeReadStatus.TimeOverRead,
  );

  const lastOrderAtDate = useMemo(() => (lastOrderAt ? new Date(lastOrderAt) : new Date()), [lastOrderAt]);
  const calculateMinutesLeft = useCallback(() => getMinutesDiff(new Date(), lastOrderAtDate), [lastOrderAtDate]);

  const [minutesLeft, setMinutesLeft] = useState<number>(calculateMinutesLeft);
  const lastOrderPassedNotice = useDisclosure();

  const [notificationDialogStat, setNotificationDialogStat] = useState<ShowNotificationDialogStat>(() =>
    resolveNotificationDialogState({
      minutesLeft,
      alreadyReadTenMinutesNotice,
      alreadyReadLastOrderPassedNotice,
    }),
  );

  useEffect(() => {
    const timerAction = (timerId?: NodeJS.Timeout) => {
      const minutesLeft = calculateMinutesLeft();
      setMinutesLeft(minutesLeft);
      setNotificationDialogStat(
        resolveNotificationDialogState({
          minutesLeft,
          alreadyReadTenMinutesNotice,
          alreadyReadLastOrderPassedNotice,
        }),
      );
      if (alreadyReadLastOrderPassedNotice) {
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
    alreadyReadLastOrderPassedNotice,
    alreadyReadTenMinutesNotice,
    calculateMinutesLeft,
    lastOrderAtDate,
    lastOrderPassedNotice,
  ]);

  const handleConfirmLastTenMinutesNotice = useCallback(() => {
    setAlreadyReadTenMinutesNotice(true);
    setNotificationDialogStat('close');
  }, []);

  const handleConfirmLastOrderPassedNotice = useCallback(() => {
    setAlreadyReadLastOrderPassedNotice(true);
    setNotificationDialogStat('close');
  }, []);

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

      <LastTenMinutesNoticeDialog
        minutesLeft={minutesLeft}
        isOpen={notificationDialogStat === 'show-last-10-minutes'}
        onClickOk={handleConfirmLastTenMinutesNotice}
      />
      <LastOrderPassedNoticeDialog
        courseMenuCategoryName={category?.name ?? ''}
        isOpen={notificationDialogStat === 'show-last-order-passed'}
        onClickOk={handleConfirmLastOrderPassedNotice}
      />
    </>
  );
};

const LastTenMinutesNoticeDialog = ({
  minutesLeft,
  isOpen,
  onClickOk,
}: {
  minutesLeft: number;
  isOpen: boolean;
  onClickOk: () => void;
}) => {
  const [{ fetching }, updateCourseMenuNoticeStatus] = useUpdateUserCourseMenuNoticeStatusMutation();
  const handleOnClick = async () => {
    // OKをクリックしたらすぐにダイアログを閉じて、結果は待たないで良い (単なる通知の確認のため)
    updateCourseMenuNoticeStatus({
      input: {
        status: UserCourseMenuNoticeStatus.Read_10MinutesNotice,
      },
    });
    onClickOk();
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
  onClickOk,
}: {
  courseMenuCategoryName: string;
  isOpen: boolean;
  onClickOk: () => void;
}) => {
  const [{ fetching }, updateCourseMenuNoticeStatus] = useUpdateUserCourseMenuNoticeStatusMutation();
  const handleOnClick = async () => {
    // OKをクリックしたらすぐにダイアログを閉じて、結果は待たないで良い (単なる通知の確認のため)
    updateCourseMenuNoticeStatus({
      input: {
        status: UserCourseMenuNoticeStatus.ReadEndNotice,
      },
    });
    onClickOk();
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

type ShowNotificationDialogStat = 'close' | 'show-last-10-minutes' | 'show-last-order-passed';

export const resolveNotificationDialogState = ({
  minutesLeft,
  alreadyReadTenMinutesNotice,
  alreadyReadLastOrderPassedNotice,
}: {
  minutesLeft: number;
  alreadyReadTenMinutesNotice: boolean;
  alreadyReadLastOrderPassedNotice: boolean;
}): ShowNotificationDialogStat => {
  if (minutesLeft <= 0) {
    if (alreadyReadLastOrderPassedNotice) {
      return 'close';
    }
    return 'show-last-order-passed';
  }
  if (minutesLeft <= 10) {
    if (alreadyReadTenMinutesNotice) {
      return 'close';
    }
    return 'show-last-10-minutes';
  }
  return 'close';
};
