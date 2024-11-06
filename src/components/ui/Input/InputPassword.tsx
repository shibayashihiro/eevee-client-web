import { InputRightElement, Text } from '@chakra-ui/react';
import { ComponentProps, FC, useState } from 'react';

import { BasicInput } from './BasicInput';
import { InputWithLabel } from './InputWithLabel';

export type InputProps = ComponentProps<typeof BasicInput>;

type InputPasswordProps = Omit<InputProps, 'type'> & {
  id: string;
  label: string;
};

export const InputPassword: FC<InputPasswordProps> = (props) => {
  const { id, label, ...inputProps } = props;
  const [show, setShow] = useState(false);

  const handleClickShow = () => setShow((prev) => !prev);

  return (
    <InputWithLabel
      id={id}
      label={label}
      type={show ? 'text' : 'password'}
      inputGroupElement={
        <InputRightElement h="full" mr="12px">
          <Text
            className="bold-extra-small"
            color="mono.secondary"
            onClick={handleClickShow}
            _hover={{
              cursor: 'pointer',
            }}
          >
            {show ? '隠す' : '表示'}
          </Text>
        </InputRightElement>
      }
      {...inputProps}
    />
  );
};
