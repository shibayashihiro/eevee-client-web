import { Box, Button, Grid, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useCallback, useEffect, useMemo, useState } from 'react';
import React from 'react';

import { OrderType } from '@/graphql/generated/types';
import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';

import { useGetScheduleOrderAvailableDatesQuery } from './scheduledOrderTimesByDate.fragment.generated';

export const CalendarComponent = ({
  orderType,
  handleDateSelect,
  isSelected,
}: {
  orderType: OrderType;
  handleDateSelect: (date: Date) => void;
  isSelected: (date: Date) => boolean;
}) => {
  const facilityId = useFacilityId();

  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [result] = useGetScheduleOrderAvailableDatesQuery({
    variables: {
      facilityID: facilityId,
      orderType: orderType,
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

  const availableDates = useMemo(() => data?.scheduleOrderAvailableDates ?? [], [data?.scheduleOrderAvailableDates]);

  const currentMonthData = useMemo(() => {
    if (availableDates.length > 0) {
      return availableDates[currentMonthIndex];
    }
    return { year: 0, month: 0, days: [] };
  }, [availableDates, currentMonthIndex]);

  const currentMonthDays = useMemo(() => {
    return new Date(currentMonthData.year, currentMonthData.month, 0).getDate();
  }, [currentMonthData]);

  // Map of available days in current month
  const currentMonthAvailableDays = useMemo(() => {
    const map: { [key: number]: boolean } = {};
    currentMonthData.days.forEach((day) => {
      map[day] = true;
    });
    return map;
  }, [currentMonthData]);

  const handlePrevMonth = useCallback(() => {
    if (currentMonthIndex > 0) {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  }, [currentMonthIndex]);

  const handleNextMonth = useCallback(() => {
    if (currentMonthIndex < availableDates.length - 1) {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  }, [currentMonthIndex, availableDates.length]);

  return (
    <VStack spacing={4} alignItems="start" w="full">
      <HStack justifyContent="space-between" width="100%">
        <Button onClick={handlePrevMonth} isDisabled={currentMonthIndex === 0} variant="ghost">
          <HStack w={16} justify="start">
            <Icon as={ChevronLeftIcon} />
            {currentMonthIndex > 0 ? (
              <Text className="bold-normal">
                {currentMonthIndex > 0 ? `${availableDates[currentMonthIndex - 1].month}月` : ''}
              </Text>
            ) : null}
          </HStack>
        </Button>
        <Text className="text-normal">{`${currentMonthData.year}年${currentMonthData.month}月`}</Text>
        <Button onClick={handleNextMonth} isDisabled={currentMonthIndex === availableDates.length - 1} variant="ghost">
          <HStack w={16} justify="end">
            <Text className="bold-normal">
              {currentMonthIndex < availableDates.length - 1 ? `${availableDates[currentMonthIndex + 1].month}月` : ''}
            </Text>
            <Icon as={ChevronRightIcon} />
          </HStack>
        </Button>
      </HStack>

      <Grid templateColumns="repeat(7, 1fr)" gap={2} w="full" textAlign="center">
        {daysOfWeek.map((dayOfWeek) => (
          <Text key={dayOfWeek} fontWeight="bold" color={getDayColorForCalendar(dayOfWeek)}>
            {dayOfWeek}
          </Text>
        ))}
      </Grid>

      <Grid templateColumns="repeat(7, 1fr)" gap={2} w="full">
        {/* Empty cells to start where it supposed to be */}
        {Array.from({ length: new Date(currentMonthData.year, currentMonthData.month - 1, 1).getDay() }).map((_, i) => (
          <Box key={`empty-${i}`}></Box>
        ))}
        {Array.from({ length: currentMonthDays }).map((_, i) => {
          const day = i + 1;
          const date = new Date(currentMonthData.year, currentMonthData.month - 1, day);
          const available = currentMonthAvailableDays[day];
          return (
            <DayCell
              key={`$currentMonthData.year}-${currentMonthData.month}-${day}`}
              day={day}
              date={date}
              isSelected={isSelected(date)}
              available={available}
              handleDateSelect={handleDateSelect}
            />
          );
        })}
      </Grid>
    </VStack>
  );
};

function DayCell({
  day,
  isSelected,
  available,
  date,
  handleDateSelect,
}: {
  day: number;
  isSelected: boolean;
  available: boolean;
  date: Date;
  handleDateSelect: (date: Date) => void;
}) {
  return (
    <Button
      onClick={() => (available ? handleDateSelect(date) : null)}
      backgroundColor={isSelected ? 'brand.primary' : available ? 'brand.backgroundSoft' : 'gainsboro'}
      color={isSelected ? 'white' : available ? 'primaryText' : 'primary'}
      opacity={available ? 1 : 0.3}
      variant={isSelected ? 'solid' : 'outline'}
      border={0}
      _hover={{}}
    >
      {day}
    </Button>
  );
}

enum dayOfWeekType {
  Sunday = '日',
  Monday = '月',
  Tuesday = '火',
  Wednesday = '水',
  Thursday = '木',
  Friday = '金',
  Saturday = '土',
}

const daysOfWeek = [
  dayOfWeekType.Sunday,
  dayOfWeekType.Monday,
  dayOfWeekType.Tuesday,
  dayOfWeekType.Wednesday,
  dayOfWeekType.Thursday,
  dayOfWeekType.Friday,
  dayOfWeekType.Saturday,
];

const getDayColorForCalendar = (day: dayOfWeekType): string => {
  switch (day) {
    case dayOfWeekType.Sunday:
      return '#CC333F';
    case dayOfWeekType.Saturday:
      return '#134B9D';
    default:
      return '#333'; // Fallback color
  }
};
