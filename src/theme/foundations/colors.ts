export type BasicColors = {
  black: string;
  white: string;
  mono: {
    primary: string;
    secondary: string;
    white: string;
    bg: string;
    backGround: string;
    backGroundLight: string;
    divider: string;
    hint: string;
    error: string;
    errorBackground: string;
  };
};

export type BrandColors = {
  primary: string;
  primaryText: string;
  background: string;
  backgroundSoft: string;
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

const tempColor = '#000000';

type Colors = BasicColors & { brand: BrandColors };

// 色の実体はアプリ実行時に決定するが、 codegen:theme-typings した時に補完が効くように、
// ここで色の型だけ定義しておく
export const colors: Colors = {
  black: tempColor,
  white: tempColor,
  mono: {
    primary: tempColor,
    secondary: tempColor,
    white: tempColor,
    bg: tempColor,
    backGround: tempColor,
    backGroundLight: tempColor,
    divider: tempColor,
    hint: tempColor,
    error: tempColor,
    errorBackground: tempColor,
  },
  brand: {
    primary: tempColor,
    primaryText: tempColor,
    background: tempColor,
    backgroundSoft: tempColor,
    50: tempColor,
    100: tempColor,
    200: tempColor,
    300: tempColor,
    400: tempColor,
    500: tempColor,
    600: tempColor,
    700: tempColor,
    800: tempColor,
    900: tempColor,
  },
} as const;
