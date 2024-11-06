import { Box, Divider, HStack, Icon, ListItem, OrderedList, Text, useDisclosure, VStack } from '@chakra-ui/react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useCallback, useEffect, useMemo, useState } from 'react';
import React from 'react';

import { NextPageWithLayout } from '@/types';
import { OrderType, DateInput, ScheduledOrderTimeType, ScheduledOrderTimeItem } from '@/graphql/generated/types';
import { useFacilityId, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useGlobalLoadingSpinnerDispatch, useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button';
import { ModalDialog } from '@/components/ui/ModalDialog';
import { CheckIcon } from '@/components/ui/Icons/CheckIcon';
import { generateMutationId } from '@/graphql/helper';
import { useUpdateScheduledOrderTimeMutation } from '@/components/domain/ScheduledOrderTimeListDialog/ScheduledOrderTimeListDialog.mutation.generated';

import { useGetScheduledOrderTimeListByDateQuery } from './scheduledOrderTimesByDate.fragment.generated';
import { CalendarComponent } from './Calender';

// 現状はテイクアウトのみの対応
const OrderDateSelection: NextPageWithLayout = () => {
  const router = useTenantRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedScheduledOrderTimeItem, setSelectedScheduledOrderTimeItem] = useState<ScheduledOrderTimeItem | null>(
    null,
  );
  const facilityId = useFacilityId();
  const orderType = OrderType.Takeout;

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
    const { error } = await updateSchedule({
      input: {
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
      },
    });
    setLoading(false);
    if (error) {
      handleErrorWithAlertDialog(error);
    }
    router.back();
  };

  return (
    <>
      <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box as="main" flex="1">
          <VStack flex={1} spacing={4} alignItems="start" px={30} py={20} overflowY="auto">
            <Text fontSize={18} fontWeight="bold">
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
        </Box>
        <Footer
          onCancel={() => router.back()}
          onSubmit={onSubmit}
          notReadyToSubmit={selectedDate == null || selectedScheduledOrderTimeItem == null}
        />
      </Box>

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
      <Text fontSize={18} fontWeight="bold" mt={20}>
        時間を選択してください
      </Text>
      <VStack w="full" opacity={1}>
        <Divider />
        <HStack py={4} w="full" justify="space-between" opacity={selectedDate ? 1 : 0.3} onClick={onClick}>
          {(selectedScheduledOrderTimeItem && (
            <Text fontSize={14} fontWeight="bold">
              {selectedScheduledOrderTimeItem.minArrival} 〜 {selectedScheduledOrderTimeItem.maxArrival}
            </Text>
          )) ?? (
            <Text fontSize={14} fontWeight="bold">
              選択してください
            </Text>
          )}
          <Icon as={ChevronRightIcon} w="30px" h="30px" mr="8px" />
        </HStack>
        <Divider />
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
      h="56px"
      p="18px"
      w="full"
      backgroundColor="mono.white"
      position="sticky"
      bottom="0"
      left="auto"
      height="56px"
      justifyContent="space-between"
      px={30}
      py={12}
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

export default OrderDateSelection;

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
