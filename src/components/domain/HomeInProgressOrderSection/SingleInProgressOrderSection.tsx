import { FC, useCallback } from 'react';
import { Icon, HStack, Text, VStack } from '@chakra-ui/react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { useFacilityId, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { orderDetailPage } from '@/utils/paths/facilityPages';
import { OrderType } from '@/graphql/generated/types';

const arrivalTimeTitle: Record<OrderType, string> = {
  [OrderType.Delivery]: 'お届け予定時間',
  [OrderType.Takeout]: '受け取り予定時間',
  [OrderType.EatIn]: '受け取り予定時間',
};

const shortIdTitle: Record<OrderType, string> = {
  [OrderType.Delivery]: 'お届け番号',
  [OrderType.Takeout]: '受け取り番号',
  [OrderType.EatIn]: '受け取り番号',
};

type Props = {
  id: string;
  shortIds: string[];
  stepSubject: string;
  scheduledTime: string;
  enclose?: boolean;
  orderType: OrderType;
};

export const SingleInProgressOrderSection: FC<Props> = ({
  id,
  shortIds,
  stepSubject,
  scheduledTime,
  enclose,
  orderType,
}: Props) => {
  const router = useTenantRouter();
  const facilityId = useFacilityId();
  const handleOnClick = useCallback(async () => {
    await router.push(orderDetailPage(facilityId, id, orderType));
  }, [facilityId, id, orderType, router]);

  return (
    <HStack
      w="full"
      py="12px"
      px="16px"
      justifyContent="space-between"
      border={enclose ? '1px' : '0px'}
      borderColor="mono.bg"
      borderRadius="12px"
      bgColor="mono.white"
      onClick={handleOnClick}
    >
      <VStack spacing={0} w="full" alignItems="start">
        <Text className="bold-small">{stepSubject}</Text>
        <HStack pt="8px" justifyContent="space-between" w="full">
          <Text className="bold-extra-small" color="mono.secondary">
            {arrivalTimeTitle[orderType]}
          </Text>
          <Text className="bold-small">{scheduledTime}</Text>
        </HStack>
        <HStack justifyContent="space-between" w="full">
          <Text className="bold-extra-small" color="mono.secondary">
            {shortIdTitle[orderType]}
          </Text>
          <Text className="bold-small">{shortIds}</Text>
        </HStack>
      </VStack>
      <Icon as={ChevronRightIcon} color="mono.hint" />
    </HStack>
  );
};
