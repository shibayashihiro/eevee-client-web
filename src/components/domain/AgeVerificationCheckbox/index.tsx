import { FC } from 'react';
import { Checkbox, HStack, VStack, Text } from '@chakra-ui/react';

type Props = {
  onChange: (checked: boolean) => void;
};

export const AgeVerificationCheckbox: FC<Props> = ({ onChange }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked);

  return (
    <VStack mb="24px">
      <Text className="text-small" color="mono.secondary">
        お客さまの年齢を確認させていただいております。
        未成年者の飲酒は法律で禁止されており、未成年者への酒類の販売はいたしません。
        お客さまが20歳以上の場合は以下のチェックボックスをクリックしてからご注文ください。
      </Text>
      <HStack alignItems="start" w="full">
        <Checkbox colorScheme="brand" size="lg" onChange={handleChange} />
        <Text className="text-small">わたしは20歳以上です</Text>
      </HStack>
    </VStack>
  );
};
