import { FormLabel, InputGroup, VStack } from '@chakra-ui/react';
import { ComponentProps } from 'react';

import { BasicInput } from './BasicInput';

type InputProps = ComponentProps<typeof BasicInput>;

type Props = InputProps & {
  id: string;
  label: string;
  type?: HTMLInputElement['type'];
  inputGroupElement?: React.ReactNode;
};

/**
 * @deprecated 画面ごとに必要な機能やデザインが異なるため、各ページでコンポーネントを定義する方が良い。
 */
export const InputWithLabel = ({ id, label, type = 'text', inputGroupElement, ...inputProps }: Props) => {
  return (
    <>
      <VStack w={inputProps.w} width={inputProps.width} alignItems="start" spacing="4px">
        <FormLabel htmlFor={id} mb="0" fontWeight="bold" fontSize="extra-small" color="mono.secondary">
          {label}
        </FormLabel>
        <InputGroup>
          <BasicInput id={id} type={type} {...inputProps} />
          {inputGroupElement}
        </InputGroup>
      </VStack>
    </>
  );
};
