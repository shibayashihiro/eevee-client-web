import { Text } from '@chakra-ui/react';

type Props = {
  label: string;
  variant: Variants;
};

export type Variants = 'required' | 'optional';

type ChipStyle = {
  fontColor: string;
  bgColor: string;
};

const requiredStyle: ChipStyle = {
  fontColor: 'white',
  bgColor: 'brand.primary',
} as const;

const optionalStyle: ChipStyle = {
  fontColor: 'mono.secondary',
  bgColor: 'mono.backGround',
} as const;

const styles: Record<Variants, ChipStyle> = {
  required: requiredStyle,
  optional: optionalStyle,
} as const;

export const IsRequiredChip = ({ label, variant }: Props) => {
  const style = styles[variant];
  return (
    <Text
      color={style.fontColor}
      bgColor={style.bgColor}
      fontSize="12px"
      fontWeight="semibold"
      lineHeight="140%"
      px="6px"
      borderRadius="4px"
    >
      {label}
    </Text>
  );
};
