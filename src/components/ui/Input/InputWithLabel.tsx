import { FormLabel, InputGroup, VStack } from '@chakra-ui/react';
import { ComponentProps, FC } from 'react';

import { BasicInput } from './BasicInput';

type InputProps = ComponentProps<typeof BasicInput>;

type WithLabelProps = InputProps & {
  id: string;
  label: string;
  inputGroupElement?: React.ReactNode;
};
export const InputWithLabel: FC<WithLabelProps> = (props) => {
  const { id, label, inputGroupElement, ...inputProps } = props;
  return (
    <>
      <VStack w={inputProps.w} width={inputProps.width} alignItems="start" spacing="4px">
        <FormLabel htmlFor={id} className="bold-extra-small" color="mono.secondary">
          {label}
        </FormLabel>
        <InputGroup>
          <BasicInput id={id} type="email" {...inputProps} />
          {inputGroupElement}
        </InputGroup>
      </VStack>
    </>
  );
};
