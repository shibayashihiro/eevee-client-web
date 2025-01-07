import { Text } from '@chakra-ui/react';

type Props = {
  label: string;
  variant: Variants;
};

export type Variants = 'required' | 'optional';

type ChipStyle = {
  fontColor: string;
  fontWeight: string;
  bgColor: string;
};

const requiredStyle: ChipStyle = {
  fontColor: 'white',
  fontWeight: '600',
  bgColor: 'brand.primary',
} as const;

const optionalStyle: ChipStyle = {
  fontColor: 'mono.primary',  
  fontWeight: '400',
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
      className='text-extra-small'
      fontWeight={style.fontWeight}
      lineHeight="16.8px"
      px="4px"
      borderRadius="4px"
      py="2px"
    >
      {label}
    </Text>
  );
};
