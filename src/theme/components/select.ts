import { selectAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(selectAnatomy.keys);

const baseStyle = definePartsStyle({
  field: {
    background: 'mono.bg',
    fontSize: 'small',
    fontWeight: 'bold',
    lineHeight: 'normal',
    color: 'mono.primary',
    minH: '40px',
    py: '10px',
    pl: '16px',
    pr: '12px',
    _hover: {
      borderColor: 'mono.hint',
    },
    _placeholder: {
      color: 'mono.secondary',
    },
  },
  icon: {
    color: 'mono.secondary',
    boxSize: '24px',
  },
});

export const selectTheme = defineMultiStyleConfig({ baseStyle });
