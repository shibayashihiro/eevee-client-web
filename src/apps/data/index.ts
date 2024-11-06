import { generateColorPalette, rgbHexToRGBA } from '@/utils/color';

import type { AppColor, AppConfig, AppDefinition } from '../types';

import type { ProductionIdentifier } from './production';
import type { StagingIdentifier } from './staging';

export type AppIdentifier = ProductionIdentifier | StagingIdentifier;

export const makeAppDefinition = <T extends string>(
  identifiers: readonly T[],
  configs: Record<T, AppConfig>,
): AppDefinition<T> => {
  const getConfig = (identifier: string): AppConfig | null => {
    const matched = identifiers.find((id) => id === identifier);
    if (!matched) {
      return null;
    }
    return configs[matched];
  };
  return {
    identifiers,
    configs,
    getConfig,
  };
};

/**
 * @param primaryColor ブランドカラー
 * @param primaryTextColor 基本はブランドカラーのRGBから-10した色
 * @returns
 */
export const buildAppColor = (primaryColor: string, primaryTextColor: string): AppColor => {
  const primary = rgbHexToRGBA(primaryColor);
  const primaryText = rgbHexToRGBA(primaryTextColor);
  const backgroundColor = { ...primary, a: 0.8 };
  const backgroundSoftColor = { ...primary, a: 0.1 };
  return {
    primaryColor: primary,
    primaryTextColor: primaryText,
    backgroundColor,
    backgroundSoftColor,
    colorPalette: generateColorPalette(primaryColor),
  };
};
