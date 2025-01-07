import { VStack, Text, HStack, Button } from '@chakra-ui/react';

import { useFacilityId, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { requestPaperReceiptPage } from '@/utils/paths/facilityPages';
import { OrderType } from '@/graphql/generated/types';

import { PaperReceiptRequestSelectionFragment } from './PaperReceiptRequestSelection.fragment.generated';

type Props = {
  orderType: OrderType;
  fragment: PaperReceiptRequestSelectionFragment | null;
};

export const PaperReceiptRequestSelection = ({ orderType, fragment }: Props) => {
  console.log(fragment?.needsPaperReceipt);
  return (
    <VStack align="stretch" spacing="8px">
      <Text textStyle="bold-extra-small" color="mono.secondary">
        紙の領収書
      </Text>
      <HStack
        justifyContent="space-between"
        py="16px"
        minHeight="56px"
        borderTopWidth="0.5px"
        borderBottomWidth="0.5px"
        // TODO: ↓本当はmono.dividerなのだが他の箇所が全体的にmono.backGroundになってるのでそれらを直すときに一緒に直す
        borderColor="mono.backGround"
      >
        <Text textStyle="bold-small">{fragment?.needsPaperReceipt ? '希望する' : '希望しない'}</Text>
        <GoEditButton orderType={orderType} />
      </HStack>
    </VStack>
  );
};

const GoEditButton = ({ orderType }: { orderType: OrderType }) => {
  const facilityId = useFacilityId();
  const router = useTenantRouter();
  return (
    <Button
      variant="link"
      // TODO: ↓本当はnoneにしないのが正しいが他の箇所が対応できてないので、それらを直すときに一緒に直す。
      textDecoration="none"
      onClick={() => {
        router.push(requestPaperReceiptPage(facilityId, orderType));
      }}
    >
      変更する
    </Button>
  );
};
