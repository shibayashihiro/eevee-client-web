import React, { useCallback, useState } from 'react';
import { Box, FormControl, VStack, Text, FormLabel } from '@chakra-ui/react';

import { containerMarginX } from '@/utils/constants';
import { BasicInput } from '@/components/ui/Input';
import { PrimaryButton } from '@/components/ui/Button';
import { useAddCouponMutation } from '@/components/domain/CouponForm/CouponForm.mutation.generated';
import { generateMutationId } from '@/graphql/helper';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import variables from '@/styles/variables.module.scss';

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
  return (
    <>
      <VStack mx="auto" px={containerMarginX} spacing={0} pt="40px" pb="32px" maxW={variables.containerMaxWidth}>
        <Text className="text-small">クーポンコードをお持ちの場合は、こちらにご入力ください。</Text>
        <FormControl mt="32px">
          <FormLabel fontWeight="bold" fontSize="extra-small" color="mono.secondary">
            クーポンコード
          </FormLabel>
          <BasicInput type="text" value={code} onChange={handleChangeCode} />
        </FormControl>
        <Box w="full" py="32px" pos="sticky" bottom={0} left={0} right={0}>
          <PrimaryButton h="56px" disabled={!submitButtonEnabled} onClick={handleSubmit} isLoading={result.fetching}>
            追加する
          </PrimaryButton>
        </Box>
      </VStack>
    </>
  );
};
