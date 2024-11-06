import { FC } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

import variables from '@/styles/variables.module.scss';
import { AppColor } from '@/apps';
import { toString, toStrings } from '@/utils/color';

const breakpoints = {
  // デザイン仕様に沿ってbreakpointを上書き
  sm: '320px',
  md: '640px',
};

// ChakraUIのThemeを活用しないと一部のComponent(Radio、Checkbox)のスタイリングが厳しかったためThemeをextendするようにしている
const baseTheme = {
  breakpoints,
  colors: {
    black: variables.monoPrimary,
    white: variables.monoWhite,
    mono: {
      primary: variables.monoPrimary,
      secondary: variables.monoSecondary,
      white: variables.monoWhite,
      bg: variables.monoBackGround,
      backGround: variables.monoBackGround,
      backGroundLight: variables.monoBackGroundLight,
      divider: variables.monoDivider,
      hint: variables.monoHint,
      error: variables.monoError,
      errorBackground: variables.errorBackground,
    },
  },
  styles: {
    global: {
      // hack: https://github.com/chakra-ui/chakra-ui/issues/2234
      '.js-focus-visible :focus:not(.focus-visible), .js-focus-visible :focus:not(.focus-visible) + [data-focus]': {
        outline: 'none',
        shadow: 'none',
      },
    },
  },
};

type Props = {
  children: React.ReactNode;
  appColor: AppColor;
};

type ChakraColor = {
  [key: string]: string;
};

export const ChakraWithThemeProvider: FC<Props> = ({ appColor, children }) => {
  const brandColor: ChakraColor = {
    ...toStrings(appColor.colorPalette),
    // 例) <Text color="brand.primary">...</Text> のようにして利用可能
    primary: toString(appColor.primaryColor),
    primaryText: toString(appColor.primaryTextColor),
    background: toString(appColor.backgroundColor),
    backgroundSoft: toString(appColor.backgroundSoftColor),
  };
  const theme = extendTheme({
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      brand: brandColor,
    },
  });
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};
