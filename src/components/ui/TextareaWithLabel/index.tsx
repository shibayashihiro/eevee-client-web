import { ComponentProps, FC } from 'react';
import { FormLabel, Textarea, VStack } from '@chakra-ui/react';

type TextareaProps = ComponentProps<typeof Textarea>;

type WithLabelProps = TextareaProps & {
  id: string;
  label: string;
};

export const TextareaWithLabel: FC<WithLabelProps> = (props) => {
  const { id, label, ...textareaProps } = props;
  return (
    <VStack w={textareaProps.w} width={textareaProps.width} alignItems="start">
      <FormLabel htmlFor={id} className="bold-extra-small" color="mono.secondary">
        {label}
      </FormLabel>
      <Textarea id={id} className="bold-medium" bg="mono.bg" color="mono.primary" {...textareaProps} />
    </VStack>
  );
};
