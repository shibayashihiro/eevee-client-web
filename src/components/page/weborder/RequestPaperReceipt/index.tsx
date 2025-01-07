import { ParsedUrlQuery } from 'querystring';

import { useRouter } from 'next/router';
import { Button, Container, Flex, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';
import { useState } from 'react';

import { NextPageWithLayout } from '@/types';
import { InsideNavbar } from '@/components/ui/InsideNavbar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { isOrderType, useAdditionalTypeNamesContext } from '@/graphql/helper';
import { OrderType, PaperReceiptRequest } from '@/graphql/generated/types';
import { useFacilityId, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { cartPage } from '@/utils/paths/facilityPages';

import { useGetCartForRequestPaperReceiptPageQuery } from './RequestPaperReceipt.query.generated';
import { useSubmitRequestPaperReceiptMutation } from './RequestPaperReceipt.mutation.generated';

const isValidQuery = (query: ParsedUrlQuery): query is { orderType: OrderType } => {
  return isOrderType(query.orderType);
};

export const RequestPaperReceiptPage: NextPageWithLayout = () => {
  const router = useRouter();

  if (!isValidQuery(router.query)) {
    throw new Error('page not found');
  }

  return (
    <Flex h="100vh" direction="column">
      <InsideNavbar title="紙の領収書" />
      <Container flex={1} py="24px" px={{ base: '20px', md: '0px' }}>
        <RequestPaperReceiptPageBody orderType={router.query.orderType} />
      </Container>
    </Flex>
  );
};

const RequestPaperReceiptPageBody = ({ orderType }: { orderType: OrderType }) => {
  const facilityId = useFacilityId();
  const context = useAdditionalTypeNamesContext<[PaperReceiptRequest]>(['PaperReceiptRequest']);
  const [{ data, error, fetching }] = useGetCartForRequestPaperReceiptPageQuery({
    variables: { facilityId, orderType },
    context,
  });
  if (fetching) {
    return <LoadingSpinner />;
  }
  if (error) {
    throw error;
  }
  if (!data?.viewer?.cart) {
    throw new Error('data not found');
  }
  const { order } = data.viewer.cart;
  if (order?.__typename !== 'DeliveryOrder' && order?.__typename !== 'TakeoutOrder') {
    throw new Error('invalid Order Type');
  }
  return (
    <RequestPaperReceiptForm
      cartId={data.viewer.cart.id}
      orderType={orderType}
      initialValue={order.paperReceiptRequest?.recipientName ?? ''}
    />
  );
};

const RequestPaperReceiptForm = ({
  cartId,
  orderType,
  initialValue,
}: {
  cartId: string;
  orderType: OrderType;
  initialValue: string;
}) => {
  const router = useTenantRouter();
  const facilityId = useFacilityId();
  const [recipientName, setRecipientName] = useState(initialValue);
  const [loading, setLoading] = useState<boolean>(false);
  const [_, submitRequestPaperReceipt] = useSubmitRequestPaperReceiptMutation();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const needsPaperReceipt = recipientName.length > 0;

  const handleChangeRecipientName = (event: React.ChangeEvent<HTMLInputElement>) =>
    setRecipientName(event.target.value);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { error } = await submitRequestPaperReceipt({
        input: {
          cartId,
          needsPaperReceipt,
          recipientName,
        },
      });
      if (error) {
        handleErrorWithAlertDialog(error);
        return;
      }
      return router.push(cartPage(facilityId, orderType));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack align="stretch" spacing="40px">
        <VStack align="stretch" spacing="4px">
          <FormControl>
            <FormLabel fontWeight="bold" fontSize="extra-small" color="mono.secondary">
              宛名
            </FormLabel>
            <Input
              type="text"
              placeholder="株式会社＊＊＊＊＊"
              value={recipientName}
              onChange={handleChangeRecipientName}
              // NOTE: 文字数無制限も微妙なので、国税庁の法人検索APIのアウトプットが150文字までしか格納しないとのことなのでそれに合わせている。
              maxLength={150}
            />
          </FormControl>
        </VStack>
        <Button
          type="submit"
          variant={needsPaperReceipt ? 'primary' : 'secondary'}
          minHeight="56px"
          isLoading={loading}
        >
          {needsPaperReceipt ? '登録する' : '紙の領収書を希望しない'}
        </Button>
      </VStack>
    </form>
  );
};
