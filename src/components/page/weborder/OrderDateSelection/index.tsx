import {
  Box,
  Divider,
  HStack,
  Icon,
  ListItem,
  OrderedList,
  Text,
  useDisclosure,
  VStack,
  Container,
} from '@chakra-ui/react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useCallback, useEffect, useMemo, useState } from 'react';
import React from 'react';

import { NextPageWithLayout } from '@/types';
import {
  OrderType,
  DateInput,
  ScheduledOrderTimeType,
  ScheduledOrderTimeItem,
  DeliveryType,
  UpdateScheduledOrderTimeInput,
} from '@/graphql/generated/types';
import { useFacilityId, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useGlobalLoadingSpinnerDispatch, useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button';
import { InsideNavbar } from '@/components/ui/InsideNavbar';
import { ModalDialog } from '@/components/ui/ModalDialog';
import { CheckIcon } from '@/components/ui/Icons/CheckIcon';
import { generateMutationId } from '@/graphql/helper';
import { useUpdateScheduledOrderTimeMutation } from '@/components/domain/ScheduledOrderTimeListDialog/ScheduledOrderTimeListDialog.mutation.generated';
import { containerMarginX } from '@/utils/constants';

import { useGetScheduledOrderTimeListByDateQuery } from './scheduledOrderTimesByDate.fragment.generated';
import { CalendarComponent } from './Calender';

export const genOrderDateSelectionPage = (orderType: OrderType): NextPageWithLayout => {
  return function OrderDateSelection() {
    return <OrderDateSelectionPage orderType={orderType} />;
  };
};

type Props = {
  orderType: OrderType;
};

// 現状はテイクアウトのみの対応
const OrderDateSelectionPage = ({ orderType }: Props) => {
  const router = useTenantRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedScheduledOrderTimeItem, setSelectedScheduledOrderTimeItem] = useState<ScheduledOrderTimeItem | null>(
    null,
  );
  const facilityId = useFacilityId();

  const itemListDialogState = useDisclosure();
  const setLoading = useGlobalLoadingSpinnerDispatch();

  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();
  const handleDateSelect = useCallback(
    (date: Date) => {
      if (isSameDate(date, selectedDate)) {
        return;
      }
      // Reset selected time everytime to prevent users from selecting an invalid time
      setSelectedScheduledOrderTimeItem(null);
      setSelectedDate(date);
    },
    [setSelectedDate, selectedDate],
  );

  const [_, updateSchedule] = useUpdateScheduledOrderTimeMutation();

  const onSubmit = async () => {
    if (!selectedScheduledOrderTimeItem) return;
    setLoading(true);

    const input: UpdateScheduledOrderTimeInput = {
      clientMutationId: generateMutationId(),
      type: ScheduledOrderTimeType.ScheduleDate,
      orderType: orderType,
      facilityId: facilityId,
      maxArrival: selectedScheduledOrderTimeItem.maxArrival,
      minArrival: selectedScheduledOrderTimeItem.minArrival,
      date: {
        year: selectedDate!.getFullYear(),
        month: selectedDate!.getMonth() + 1,
        day: selectedDate!.getDate(),
      },
    };
    if (orderType == OrderType.Delivery) {
      input.deliveryType = DeliveryType.PreOrder; // 日時指定は常に予約注文
    }
    const { error } = await updateSchedule({ input });
    setLoading(false);
    if (error) {
      handleErrorWithAlertDialog(error);
    }
    router.back();
  };

  return (
    <>
      <InsideNavbar title="日時を指定する" />
      <Container as="main" px={containerMarginX}>
        <VStack flex={1} spacing="0" alignItems="start" pt="24px" pb="160px" overflowY="auto">
          <Text className="bold-large" mb="16px">
            受け取り日付を選択してください
          </Text>
          <CalendarComponent
            orderType={orderType}
            handleDateSelect={handleDateSelect}
            isSelected={(date) => selectedDate?.toDateString() === date.toDateString()}
          />
          <TimeRangeSection
            selectedDate={selectedDate}
            selectedScheduledOrderTimeItem={selectedScheduledOrderTimeItem}
            onClick={() => selectedDate && itemListDialogState.onOpen()}
          />
        </VStack>
      </Container>
      <Footer
        onCancel={() => router.back()}
        onSubmit={onSubmit}
        notReadyToSubmit={selectedDate == null || selectedScheduledOrderTimeItem == null}
      />

      {selectedDate && itemListDialogState.isOpen && (
        <ScheduledOrderTimeListDialog
          facilityId={facilityId}
          orderType={orderType}
          selectedDate={selectedDate!}
          isOpen={itemListDialogState.isOpen}
          isSelected={(item) => {
            if (!selectedScheduledOrderTimeItem) {
              return item.selected;
            }
            return item == selectedScheduledOrderTimeItem;
          }}
          onSelect={(item) => {
            setSelectedScheduledOrderTimeItem(item);
            itemListDialogState.onClose();
          }}
          onClose={() => itemListDialogState.onClose()}
        />
      )}
    </>
  );
};

const TimeRangeSection = ({
  selectedDate,
  selectedScheduledOrderTimeItem,
  onClick,
}: {
  selectedDate: Date | null;
  selectedScheduledOrderTimeItem: ScheduledOrderTimeItem | null;
  onClick: () => void;
}) => {
  return (
    <>
      <Text className="bold-large" mt="32px" mb="8px">
        時間を選択してください
      </Text>
      <VStack w="full" opacity={1} gap="0">
        <HStack
          py="16px"
          w="full"
          justify="space-between"
          opacity={selectedDate ? 1 : 0.3}
          onClick={onClick}
          borderTop="1px"
          borderTopColor="mono.divider"
          borderBottom="1px"
          borderBottomColor="mono.divider"
        >
          {(selectedScheduledOrderTimeItem && (
            <Text className="bold-small">
              {selectedScheduledOrderTimeItem.minArrival} 〜 {selectedScheduledOrderTimeItem.maxArrival}
            </Text>
          )) ?? <Text className="bold-small">選択してください</Text>}
          <Icon as={ChevronRightIcon} w="24px" h="24px" />
        </HStack>
      </VStack>
    </>
  );
};

const Footer = ({
  onSubmit,
  onCancel,
  notReadyToSubmit,
}: {
  onSubmit: () => void;
  onCancel: () => void;
  notReadyToSubmit: boolean;
}) => {
  return (
    <HStack
      zIndex="sticky"
      w="full"
      backgroundColor="mono.white"
      position="fixed"
      bottom="0"
      // top="100vh"
      left="auto"
      justifyContent="space-between"
      px="20px"
      pt="20px"
      pb="32px"
      borderTop="1px"
      borderTopColor="mono.divider"
    >
      <SecondaryButton h="56px" rounded="32px" onClick={onCancel}>
        キャンセル
      </SecondaryButton>
      <PrimaryButton h="56px" rounded="32px" onClick={onSubmit} disabled={notReadyToSubmit}>
        日時を指定する
      </PrimaryButton>
    </HStack>
  );
};

const ScheduledOrderTimeListDialog = ({
  facilityId,
  orderType,
  selectedDate,
  isOpen,
  onSelect,
  isSelected,
  onClose,
}: {
  facilityId: string;
  orderType: OrderType;
  selectedDate: Date;
  isOpen: boolean;
  onSelect: (item: ScheduledOrderTimeItem) => void;
  isSelected: (item: ScheduledOrderTimeItem) => boolean;
  onClose: () => void;
}) => {
  const [result] = useGetScheduledOrderTimeListByDateQuery({
    variables: {
      facilityID: facilityId,
      orderType: orderType,
      date: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate(),
      } as DateInput,
    },
  });
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();
  const { data, error, fetching } = result;
  useLoadingOverlay(fetching);

  useEffect(() => {
    if (error) {
      handleErrorWithAlertDialog(error);
    }
  }, [error, handleErrorWithAlertDialog]);

  const scheduledOrderTimes = useMemo(() => data?.scheduledOrderTimesByDate ?? [], [data]);

  const [selectedItem, setSelectedItem] = useState<ScheduledOrderTimeItem | null>(null);
  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      trapFocus={false}
      scrollBehavior={'inside'}
      primaryAction={{
        text: '時間を選択する',
        onClick: () => {
          onSelect(selectedItem!);
        },
        disabled: selectedItem === null,
      }}
      secondaryAction={{
        text: 'キャンセル',
        onClick: onClose,
      }}
      title="時間を選択してください"
    >
      <Box mt="8px" mb="16px" w="full">
        <Divider />
        <OrderedList styleType="none" marginStart="0px">
          {scheduledOrderTimes.map((innerItem, itemIndex) => {
            const selected = selectedItem != null ? innerItem == selectedItem : isSelected(innerItem);
            return (
              <ListItem
                pt="16px"
                pb="16px"
                key={itemIndex}
                borderBottom="1px"
                borderColor="mono.divider"
                onClick={() => (innerItem.disabled ? null : setSelectedItem(innerItem))}
              >
                <HStack
                  justifyContent={selected ? 'space-between' : 'start'}
                  _hover={{}}
                  color={innerItem.disabled ? 'mono.hint' : selected ? 'brand.primaryText' : ''}
                >
                  <Text
                    fontSize="md"
                    textDecoration={innerItem.disabled ? 'line-through' : ''}
                    fontWeight="bold"
                    color={selected ? 'brand.primaryText' : ''}
                  >
                    {innerItem.name}
                  </Text>
                  {innerItem.disabled && (
                    <Text fontSize="md" fontWeight="bold">
                      現在注文できません
                    </Text>
                  )}
                  {selected && <Icon as={CheckIcon} color="brand.primaryText" />}
                </HStack>
              </ListItem>
            );
          })}
        </OrderedList>
      </Box>
    </ModalDialog>
  );
};

const isSameDate = (date1: Date, date2?: Date | null): boolean => {
  if (!date2) {
    return false;
  }
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
