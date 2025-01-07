import { defineStyle, defineStyleConfig, SystemStyleObject } from '@chakra-ui/react';

const disabledStyles = {
  color: 'mono.white',
  bg: 'mono.hint',
  _hover: {
    bg: 'mono.hint',
  },
};

const defaultProps = {
  fontSize: 'md',
  fontWeight: 'bold',
  rounded: '32px',
  width: 'full',
  _disabled: { ...disabledStyles },
};

const variants: Record<string, SystemStyleObject> = {
  primary: defineStyle({
    ...defaultProps,
    bg: 'brand.500',
    color: 'mono.white',
    _hover: {
      bg: 'brand.300',
      _disabled: {
        ...disabledStyles,
      },
    },
    _active: {
      bg: 'brand.400',
    },
  }),
  secondary: defineStyle({
    bg: 'mono.bg',
    color: 'mono.primary',
    _hover: {
      bg: 'gray.100',
      _disabled: {
        ...disabledStyles,
      },
    },
    ...defaultProps,
  }),
  link: defineStyle({
    color: 'brand.primaryText',
    fontSize: 'small',
    fontWeight: 'normal',
    textDecoration: 'underline',
  }),
};

export const buttonTheme = defineStyleConfig({
  defaultProps: {
    // TODO: 全体に適用して良いタイミング（全体的にスタイルを見直せるタイミング）でコメントアウトを外す
    // variant: 'primary',
  },
  variants,
});
