import type { AppConfig } from '../types';

import { buildAppColor, makeAppDefinition } from '.';

const stagingIdentifiers = [
  'chompy-house',
  'chompy-steak-house',
  'ikinaristeak-demo',
  'suage-demo',
  'chompy-cafe-stg',
  'pisola-stg',
  'chompy-house-suzukenz',
  'spice-theater',
  'napoli-pizza-dev',
  'popolamama-stg',
] as const;

export type StagingIdentifier = (typeof stagingIdentifiers)[number];

const stagingConfigs: Record<StagingIdentifier, AppConfig> = {
  'chompy-house': {
    tenantUidHeader: '3EbSfT6RCgXZDspYz8f4',
    appColor: buildAppColor('#AAAA32', '#A0A032'),
    pageMeta: {
      title: 'CHOMPY HOUSE',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '1657566651-WnrXragZ',
    promotionEnabled: false,
  },
  'chompy-steak-house': {
    tenantUidHeader: '3EbSfT6RCgXZDspYz8f4',
    appColor: buildAppColor('#AAAA32', '#A0A032'),
    pageMeta: {
      title: 'CHOMPY HOUSE',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '1657566651-WnrXragZ',
    promotionEnabled: true,
  },
  'ikinaristeak-demo': {
    tenantUidHeader: 'wQwAvAIqkUt6vfoWKv4C',
    appColor: buildAppColor('#000000', '#000000'),
    pageMeta: {
      title: 'いきなりステーキ様デモ環境',
      favicon: '/favicons/ikinaristeak.png',
    },
    uiCustomization: {
      tenantHomeNoteText: '※一部の店舗ではご利用できません',
      isIkinariSteak: true,
    },
  },
  'suage-demo': {
    tenantUidHeader: 'MCjH6dgTJYUYZUMPlXls',
    appColor: buildAppColor('#D6001C', '#D3281A'),
    pageMeta: {
      title: '（Staging）Suage',
      favicon: '/favicons/suage.png',
    },
    liffId: '2000739452-WXNqL4LR',
  },
  'chompy-cafe-stg': {
    tenantUidHeader: 'UeMkZKDdNKIlFwsTDpmZ',
    appColor: buildAppColor('#AAAA32', '#A0A032'),
    pageMeta: {
      title: 'CHOMPY CAFE',
      favicon: '/favicons/chompy-house.ico',
    },
  },
  'pisola-stg': {
    tenantUidHeader: 'dsXpmvqoSC3ZUBfRkzZw',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'CHOMPY HOUSE',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '1657598969-7DmgJYd1',
  },
  'chompy-house-suzukenz': {
    tenantUidHeader: '3EbSfT6RCgXZDspYz8f4',
    appColor: buildAppColor('#AAAA32', '#A0A032'),
    pageMeta: {
      title: 'CHOMPY HOUSE',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '1657612062-yJm8qGbO',
    uiCustomization: {
      isIkinariSteak: false,
    },
  },
  'spice-theater': {
    tenantUidHeader: 'UslkVopUCYXlcy8BTuLN',
    appColor: buildAppColor('#5f9ea0', '#559496'),
    pageMeta: {
      title: 'Spice Theater',
      favicon: '/favicons/chompy-house.ico', // 仮のアイコンなので後で変更
    },
    liffId: '1657566651-WnrXragZ',
  },
  'napoli-pizza-dev': {
    tenantUidHeader: 'F3KPKbxGoWAEfipdgI29',
    appColor: buildAppColor('#A31616', '#990C0C'),
    pageMeta: {
      title: 'ナポリの窯 - Staging',
      favicon: '/favicons/napoli-pizza.png',
    },
    firebaseAuthProject: 'napoli-pizza',
    promotionEnabled: true,
  },
  'popolamama-stg': {
    tenantUidHeader: '7tdVNojKeAg7nk4ODPSi',
    appColor: buildAppColor('#E60012', '#DC0008'),
    pageMeta: {
      title: 'ポポラマーマ - Staging',
      favicon: '/favicons/chompy-house.ico',
    },
  },
} as const;

export const stagingApps = makeAppDefinition(stagingIdentifiers, stagingConfigs);
