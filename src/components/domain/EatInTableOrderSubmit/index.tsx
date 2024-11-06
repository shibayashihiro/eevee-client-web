import React, { FC, useCallback } from 'react';

import {
  useHandleErrorWithAlertDialog,
  useShowGlobalModalDialog,
} from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { generateMutationId } from '@/graphql/helper';
import { useGlobalLoadingSpinnerDispatch } from '@/providers/GlobalLoadingSpinnerProvider';

import { FixedOrderSubmitButton } from '../FixedOrderSubmitButton';
import { OrderPrivacyPolicyAgreement } from '../OrderPrivacyPolicyAgreement';

import { useSubmitEatInTableOrderMutation } from './EatInTableOrderSubmit.mutation.generated';

type Props = {
  disabled: boolean;
  onAfterOrderSubmitted: () => void;
};

export const EatInTableOrderSubmit: FC<Props> = ({ disabled, onAfterOrderSubmitted }: Props) => {
  const setLoading = useGlobalLoadingSpinnerDispatch();
  const { showGlobalModalDialog } = useShowGlobalModalDialog();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();
  const [_, submitOrder] = useSubmitEatInTableOrderMutation();

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await submitOrder({
        input: {
          clientMutationId: generateMutationId(),
        },
      });
      if (error) {
        return handleErrorWithAlertDialog(error);
      }
      setLoading(false);
      onAfterOrderSubmitted();
      if (data?.submitTableOrder?.postOrderMessage) {
        const { title, message } = data.submitTableOrder.postOrderMessage;
        showGlobalModalDialog(title, message);
      }
    } finally {
      setLoading(false);
    }
  }, [handleErrorWithAlertDialog, onAfterOrderSubmitted, setLoading, showGlobalModalDialog, submitOrder]);

  return (
    <>
      <OrderPrivacyPolicyAgreement />
      <FixedOrderSubmitButton onSubmit={handleSubmit} disabled={disabled} />
    </>
  );
};
