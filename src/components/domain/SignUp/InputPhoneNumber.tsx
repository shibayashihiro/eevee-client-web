import { Text, FormControl, Flex, FormErrorMessage } from '@chakra-ui/react';
import { useMemo, useState, FC, useCallback } from 'react';

import { BasicInput } from '@/components/ui/Input';
import { PrimaryButton } from '@/components/ui/Button';
import { validatePhoneNumber } from '@/utils/validator';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { toJpPhoneNumber } from '@/utils/formatUtils';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';

import { useRequestAuthCodeBySmsMutation } from './SignUp.mutation.generated';

type Props = {
  setPhoneNumber: (phoneNumber: string) => void;
  onClickNext: () => void;
};

export const InputPhoneNumber: FC<Props> = ({ setPhoneNumber, onClickNext }) => {
  // NOTE: Component内ではユーザーの入力を生で保持し、setPhoneNumberでは+81を付与する。
  const [phoneNumberLocal, setPhoneNumberLocal] = useState('');
  const [showError, setShowError] = useState(false);

  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();
  const [result, requestAuthCodeBySMS] = useRequestAuthCodeBySmsMutation();
  useLoadingOverlay(result.fetching);

  const validPhoneNumber: boolean = useMemo(() => {
    return validatePhoneNumber(phoneNumberLocal);
  }, [phoneNumberLocal]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumberLocal(e.target.value);
    if (validPhoneNumber) {
      setShowError(false);
    }
  };

  const handleBlurInput = () => {
    if (!validPhoneNumber) {
      setShowError(true);
    }
  };

  const handleClickNext = useCallback(async () => {
    if (!validPhoneNumber) {
      return;
    }
    const jpPhoneNumber = toJpPhoneNumber(phoneNumberLocal);
    const { error } = await requestAuthCodeBySMS({
      input: {
        phoneNumber: jpPhoneNumber,
      },
    });
    if (error) {
      handleErrorWithAlertDialog(error);
      return;
    }
    setPhoneNumber(jpPhoneNumber);
    onClickNext();
  }, [
    validPhoneNumber,
    phoneNumberLocal,
    requestAuthCodeBySMS,
    setPhoneNumber,
    onClickNext,
    handleErrorWithAlertDialog,
  ]);

  return (
    <Flex direction="column">
      {/* NOTE: spacingが一定じゃないのでFlexを使います。 */}
      <Text className="bold-small" w="full">
        電話番号を入力してください
      </Text>
      <FormControl mt="20px" isInvalid={showError}>
        <BasicInput
          type="tel"
          h="56px"
          textAlign="center"
          fontSize="28px"
          value={phoneNumberLocal}
          placeholder="09000000000"
          onChange={handleChangeInput}
          onBlur={handleBlurInput}
        />
        <FormErrorMessage>有効な電話番号を入力してください。</FormErrorMessage>
      </FormControl>
      <Text w="full" mt="16px" className="text-extra-small">
        当アプリをサポートしているChompy(チョンピー)が認証コードをお送りします。
      </Text>
      <PrimaryButton mt="32px" h="56px" disabled={!validPhoneNumber} onClick={handleClickNext}>
        次へ
      </PrimaryButton>
    </Flex>
  );
};
