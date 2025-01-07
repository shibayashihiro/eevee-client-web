import { HStack, Text, VStack } from '@chakra-ui/react';

import { ChargeDetailsFullListPartsFragment } from '@/components/domain/ChargeDetailsFullList/ChargeDetailsFullList.fragment.generated';
import { SecondaryButton } from '@/components/ui/Button';
import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { formatPrice } from '@/utils/formatUtils';
import { tableOrdersPage } from '@/utils/paths/facilityPages';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';

type Props = {
  charge: ChargeDetailsFullListPartsFragment;
};

export const TablePaymentHeader = ({ charge }: Props) => {
  return (
    <VStack
      as="header"
      spacing="12px"
      height="149px"
      w="full"
      bgColor="brand.primary"
      justifyContent="center"
      padding="11px 20px"
    >
      <ChargeAmount amount={charge.amount} />
      <TableOrdersButton />
    </VStack>
  );
};

const ChargeAmount = ({ amount }: { amount: number }) => {
  return (
    <HStack spacing="12px" color="mono.white">
      <Text className="bold-normal">お支払い合計</Text>
      <Text className="bold-32px">{formatPrice(amount)}</Text>
    </HStack>
  );
};

const TableOrdersButton = () => {
  const router = useTenantRouter();
  const facilityId = useFacilityId();
  const ordersLink = tableOrdersPage(facilityId);
  const onClick = () => {
    router.push(ordersLink);
  };

  return (
    <SecondaryButton colorScheme="mono" size="sm" onClick={onClick}>
      注文内容を確認する
    </SecondaryButton>
  );
};
