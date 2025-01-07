import { ComponentStyleConfig, SystemStyleObject } from '@chakra-ui/react';

const variants: Record<string, SystemStyleObject> = {
  main: {
    margin: '0 auto',
    maxWidth: {
      base: 'full',
      md: '640px',
    },
    p: 0,
  },
};

export const containerTheme: ComponentStyleConfig = {
  variants,
  defaultProps: {
    variant: 'main',
  },
} as const;
