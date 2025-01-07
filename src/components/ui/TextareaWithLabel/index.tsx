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
    <VStack w={textareaProps.w} width={textareaProps.width} alignItems="start" spacing="0">
      <FormLabel htmlFor={id} mb="4px" fontWeight="bold" fontSize="extra-small" color="mono.secondary">
        {label}
      </FormLabel>
      <Textarea id={id} className="bold-medium" bg="mono.bg" color="mono.primary" border="0" {...textareaProps} />
    </VStack>
  );
};
