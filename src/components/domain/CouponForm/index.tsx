import React, { useCallback, useState } from 'react';
import { Box, FormControl, VStack } from '@chakra-ui/react';

import { containerMarginX } from '@/utils/constants';
import { BasicInput } from '@/components/ui/Input';
import { PrimaryButton } from '@/components/ui/Button';
import { useAddCouponMutation } from '@/components/domain/CouponForm/CouponForm.mutation.generated';
import { generateMutationId } from '@/graphql/helper';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';

export const CouponForm = ({}) => {
  const router = useTenantRouter();

  const [code, setCode] = useState('');
  const [result, addCoupon] = useAddCouponMutation();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const submitButtonEnabled = code.length > 0;

  const handleChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value);

  const handleSubmit = useCallback(async () => {
    const { error } = await addCoupon({
      input: {
        clientMutationId: generateMutationId(),
        code: code,
      },
    });
    if (error) {
      handleErrorWithAlertDialog(error);
      return;
    }
    router.back();
  }, [addCoupon, code, handleErrorWithAlertDialog, router]);

  const { fetching } = result;
  useLoadingOverlay(fetching);
  return (
    <>
      <VStack mx={containerMarginX} pt="24px">
        <FormControl>
          <Box w="full">
            <BasicInput id="email" type="email" placeholder="クーポンコード" value={code} onChange={handleChangeCode} />
          </Box>
        </FormControl>
        <Box w="full" pt="34px">
          <PrimaryButton h="56px" disabled={!submitButtonEnabled} onClick={handleSubmit}>
            追加する
          </PrimaryButton>
        </Box>
      </VStack>
    </>
  );
};
