import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { generateMutationId } from '@/graphql/helper';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';

import { useSubmitSeatNumberMutation } from './useSaveSeatNumberOnRouteChange.generated';

type Props = {
  cartId?: string;
  seatNumber?: string;
};

export const useSaveSeatNumberOnRouteChange = ({ cartId, seatNumber }: Props) => {
  const router = useRouter();

  const [result, submitSeatNumber] = useSubmitSeatNumberMutation();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  useEffect(() => {
    const handleRouteChange = async () => {
      console.warn('useSaveSeatNumberOnRouteChange handleRouteChange');
      if (!cartId || !seatNumber) {
        return;
      }
      const { error } = await submitSeatNumber({
        input: {
          clientMutationId: generateMutationId(),
          cartId,
          seatNumber,
        },
      });
      console.warn('useSaveSeatNumberOnRouteChange handleRouteChange error', error);
      if (error) {
        handleErrorWithAlertDialog(error);
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [cartId, handleErrorWithAlertDialog, router, seatNumber, submitSeatNumber]);

  return {
    fetching: result.fetching,
  };
};
