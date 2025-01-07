import { FC } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

import { AppColor } from '@/apps';
import { toString, toStrings } from '@/utils/color';
import { theme } from '@/theme';
import type { BasicColors } from '@/theme/foundations/colors';
import variables from '@/styles/variables.module.scss';

type Props = {
  children: React.ReactNode;
  appColor: AppColor;
};

const basicColors: BasicColors = {
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
} as const;

export const ChakraWithThemeProvider: FC<Props> = ({ appColor, children }) => {
  const brandColor = {
    ...toStrings(appColor.colorPalette),
    // 例) <Text color="brand.primary">...</Text> のようにして利用可能
    primary: toString(appColor.primaryColor),
    primaryText: toString(appColor.primaryTextColor),
    background: toString(appColor.backgroundColor),
    backgroundSoft: toString(appColor.backgroundSoftColor),
  };
  const customTheme = extendTheme(
    {
      colors: {
        brand: brandColor,
        ...basicColors,
      },
    },
    theme,
  );
  return <ChakraProvider theme={customTheme}>{children}</ChakraProvider>;
};
