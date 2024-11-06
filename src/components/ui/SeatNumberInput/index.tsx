import React, { FC } from 'react';
import { VStack, Box, FormControl, Input, Text } from '@chakra-ui/react';

import { replaceToUpperAlphaNumerics } from '@/utils/formatUtils';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const SeatNumberInput: FC<Props> = ({ value, onChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = replaceToUpperAlphaNumerics(e.target.value).slice(0, 3);
    onChange(parsedValue);
  };

  return (
    <VStack border="1px" pt="24px" pr="20px" pb="24px" pl="20px" borderRadius="12px" borderColor="mono.bg" mb="32px">
      <Text className="bold-small">座席番号を入力してください</Text>
      <Box maxWidth="295px" w="100%" mt="16px">
        <FormControl isRequired>
          <Input
            fontSize="48px"
            fontWeight="bold"
            h="80px"
            pt="8px"
            backgroundColor="mono.bg"
            borderRadius="4px"
            placeholder="00"
            onChange={handleInputChange}
            value={value}
            textAlign="center"
          />
        </FormControl>
      </Box>
      <Text mt="8px" className="mono-secondary text-extra-small">
        番号がわからない場合はスタッフにお声がけください
      </Text>
    </VStack>
  );
};
