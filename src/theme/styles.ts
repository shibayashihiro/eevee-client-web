export const styles = {
  global: {
    // hack: https://github.com/chakra-ui/chakra-ui/issues/2234 (2024.10.29: もう不要かも？)
    '.js-focus-visible :focus:not(.focus-visible), .js-focus-visible :focus:not(.focus-visible) + [data-focus]': {
      outline: 'none',
      shadow: 'none',
    },
  },
} as const;
