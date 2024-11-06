import React, { FC, useMemo, useState } from 'react';
import { VStack, Text, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import liff from '@line/liff';

import { validatePhoneNumber, validateKana, validateEmail } from '@/utils/validator';
import { BasicInput } from '@/components/ui/Input';

type Props = {
  lastNameKana: string;
  phoneNumber: string;
  email: string;
  setLastNameKana: (lastNameKana: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setEmail: (email: string) => void;
};

export const UserInput: FC<Props> = ({
  lastNameKana,
  phoneNumber,
  email,
  setLastNameKana,
  setPhoneNumber,
  setEmail,
}) => {
  const [showPhoneNumberError, setShowPhoneNumberError] = useState(false);
  const [showNameError, setShowNameError] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);

  const validPhoneNumber: boolean = useMemo(() => {
    return validatePhoneNumber(phoneNumber);
  }, [phoneNumber]);

  const validEmail: boolean = useMemo(() => {
    return validateEmail(email);
  }, [email]);

  const handleLastNameKanaInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastNameKana(e.target.value);
  };

  const handleLastNameKanaInputBlur = () => {
    setShowNameError(!validateKana(lastNameKana));
  };

  const handlePhoneNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handlePhoneNumberInputBlur = () => {
    setShowPhoneNumberError(!validPhoneNumber);
  };

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleEmailInputBlur = () => {
    setShowEmailError(!validEmail);
  };

  return (
    <VStack border="1px" pt="24px" pr="20px" pb="24px" pl="20px" borderRadius="12px" borderColor="mono.bg" mb="32px">
      <Text className="bold-small">
        {liff.isInClient()
          ? 'ご注文に関してお店からご連絡することがございます。お手数ですがお名前とお電話番号をご登録ください。'
          : 'ご注文に関してお店からご連絡することがございます。お手数ですがお名前とお電話番号、メールアドレスをご登録ください。'}
      </Text>
      <FormControl isInvalid={showNameError}>
        <FormLabel className="mono-secondary text-extra-small">お名前（カナ）</FormLabel>
        <BasicInput
          type="text"
          name="family-name-kana"
          autocomplete="family-name"
          h="48px"
          fontSize="16px"
          fontWeight="normal"
          borderRadius="4px"
          value={lastNameKana}
          placeholder="ヤマダ"
          onChange={handleLastNameKanaInputChange}
          onBlur={handleLastNameKanaInputBlur}
        />
        <FormErrorMessage>カナで入力してください。</FormErrorMessage>
      </FormControl>
      <FormControl pt="20px" isInvalid={showPhoneNumberError}>
        <FormLabel className="mono-secondary text-extra-small">お電話番号</FormLabel>
        <BasicInput
          type="tel"
          h="48px"
          name="tel"
          autocomplete="tel"
          placeholder="09000000000"
          borderRadius="4px"
          fontSize="16px"
          fontWeight="normal"
          value={phoneNumber}
          onChange={handlePhoneNumberInputChange}
          onBlur={handlePhoneNumberInputBlur}
        />
        <FormErrorMessage>有効な電話番号を入力してください。</FormErrorMessage>
      </FormControl>
      {!liff.isInClient() && (
        <FormControl pt="20px" isInvalid={showEmailError}>
          <FormLabel className="mono-secondary text-extra-small">メールアドレス</FormLabel>
          <BasicInput
            type="email"
            h="48px"
            name="email"
            autocomplete="email"
            placeholder="example@domain.com"
            borderRadius="4px"
            fontSize="16px"
            fontWeight="normal"
            value={email}
            onChange={handleEmailInputChange}
            onBlur={handleEmailInputBlur}
          />
          <FormErrorMessage>有効なメールアドレスを入力してください。</FormErrorMessage>
        </FormControl>
      )}
    </VStack>
  );
};
