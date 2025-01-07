import { inputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(inputAnatomy.keys);

const baseStyle = definePartsStyle({
  field: {
    minH: '48px',
    fontSize: 'normal',
    fontWeight: 'bold',
    color: 'mono.primary',
    padding: '12px',
    borderRadius: '8px',
    _placeholder: {
      color: 'mono.secondary',
    },
  },
});

const outline = definePartsStyle({
  field: {
    bg: 'mono.bg',
    border: '0',
    _focus: {
      bg: 'mono.bg',
    },
  },
});

export const inputTheme = defineMultiStyleConfig({
  variants: {
    outline,
  },
  defaultProps: {
    variant: 'outline',
  },
  baseStyle,
});
