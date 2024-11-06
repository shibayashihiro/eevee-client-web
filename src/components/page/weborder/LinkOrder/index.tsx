import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { Center, VStack, Image, Text } from '@chakra-ui/react';

import { NextPageWithLayout } from '@/types';
import { NavigationHeaderLayout } from '@/components/layouts/NavigationHeaderLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { containerMarginX } from '@/utils/constants';

import { LinkOrderMutation, useLinkOrderMutation } from './LinkOrder.mutation.generated';
import { useLinkOrderPageQuery } from './LinkOrder.query.generated';

export const LinkOrderPage: NextPageWithLayout = () => {
  const [{ data, fetching, error: fetchErr }, _] = useLinkOrderPageQuery();

  const { data: linkResult, loading, error: linkOrderErr } = useLinkOrder();

  if (!data || fetching) {
    return (
      <Center>
        <LoadingSpinner />
      </Center>
    );
  }

  if (fetchErr) {
    throw fetchErr;
  } else if (linkOrderErr) {
    throw linkOrderErr;
  }

  return (
    <NavigationHeaderLayout viewing={data.viewing} viewer={data.viewer} facility={null}>
      {loading ? (
        <Center>
          <LoadingSpinner />
        </Center>
      ) : (
        linkResult && (
          <LinkOrderResult
            resultMainText={linkResult.linkOrder.resultMainText}
            resultSubText={linkResult.linkOrder.resultSubText}
            cautionText={linkResult.linkOrder.cautionText}
          />
        )
      )}
    </NavigationHeaderLayout>
  );
};

const LinkOrderResult = ({
  resultMainText,
  resultSubText,
  cautionText,
}: {
  resultMainText: string;
  resultSubText?: string | null;
  cautionText?: string | null;
}) => {
  return (
    <VStack align="center" py="40px" mx={containerMarginX} spacing={6}>
      <Text className="bold-large">{resultMainText}</Text>
      <Image src="/assets/party_popper.gif" alt="PartyPopper" boxSize="180px" />
      {resultSubText && (
        <Text className="bold-small" align="center">
          {resultSubText}
        </Text>
      )}
      {cautionText && (
        <Text className="text-small mono-secondary" align="center">
          {cautionText}
        </Text>
      )}
    </VStack>
  );
};

const useLinkOrder = () => {
  const router = useRouter();
  const [data, setData] = useState<LinkOrderMutation | undefined>();
  const [loading, setLoading] = useState(true);
  const [{ error }, linkOrder] = useLinkOrderMutation();
  const { orderId } = router.query;

  useEffect(() => {
    if (!router.isReady || typeof orderId !== 'string' || !orderId) {
      return;
    }
    const runLinkOrder = async () => {
      if (ignore || data) {
        return;
      }
      const result = await linkOrder({
        input: {
          orderId,
        },
      });
      setData(result.data);
      setLoading(false);
    };

    let ignore = false; // race condition対策
    runLinkOrder();
    return () => {
      ignore = true;
    };
  }, [orderId, linkOrder, router.isReady, data]);

  return useMemo(() => ({ data, loading, error }), [data, loading, error]);
};
