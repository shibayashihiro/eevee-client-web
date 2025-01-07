export const textareaTheme = {
  variants: {
    outline: {
      bg: 'mono.bg',
      border: '0',
      _focus: {
        bg: 'mono.bg',
      },
    },
  },
  defaultProps: {
    variant: 'outline',
    focusBorderColor: 'mono.divider',
  },
  baseStyle: {
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
};
