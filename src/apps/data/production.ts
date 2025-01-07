import type { AppConfig } from '../types';

import { buildAppColor, makeAppDefinition } from '.';

const productionIdentifiers = [
  'chompy-demo', // Production環境デモ用
  'chompy-demo-2',
  'chompy-demo-3',
  'chompy-demo-4',
  'chompy-demo-5',
  'chompy-demo-6',
  'chompy-demo-7',
  'chompy-demo-8',
  'chompy-demo-9',
  'chompy-demo-10',
  'chompy-demo-11',
  'chompy-demo-12',
  'chompy-demo-13',
  'chompy-demo-14',
  'chompy-demo-15',
  'chompy-demo-16',
  'chompy-demo-17',
  'chompy-demo-18',
  'chompy-demo-19',
  'chompy-demo-20',
  'chompy-demo-21',
  'chompy-demo-22',
  'chompy-demo-23',
  'chompy-demo-24',
  'chompy-demo-25',
  'chompy-demo-26',
  'chompy-demo-27',
  'chompy-demo-28',
  'chompy-demo-29',
  'chompy-demo-30',
  'chompy-cafe', // Production環境でBizがセールスデモ用に使うTenant
  'yellowcompany',
  'sandwich-store',
  'suage',
  'peoplewise-cafe',
  'cafehall-ours',
  'ghost-kitchens',
  'butter-steak-nakameguro',
  'very-berry-soup',
  'waseda-monsters-kitchen',
  'bricolage-bread',
  'kenickcurry',
  'shirokuma-mikazuki',
  'amunt',
  'bombomy',
  'sonma',
  'highball-nabe-chan',
  'rairaiken',
  'upahar',
  'taiwan-cafe',
  'kunyanpocha',
  'thaispicy',
  'mayarestaurant',
  'riverside-club',
  'ikinaristeak',
  'ikinaristeak-prd-demo',
  'healthy-hut',
  'takobee',
  'yurt-cafe-bbqpark',
  'spital',
  'les-joues-de-bebe',
  'frijoles',
  'shinsaibashi-mitsuya',
  'nanas-green-tea',
  'nanas-green-tea-chofu',
  'nichijosahanji',
  'kitasandocoffee',
  'yousyusyonin',
  'dfs-shisui', // すしめん処 大京。WEBドメインがdfsのため合わせている。
  'pisola-demo',
  'pisola',
  'pisola-otsukyo',
  'pisola-yokohama-hongodai',
  'pisola-kuwana',
  'pisola-yamato-kamiwada',
  'pisola-yokkaichi-tokiwa',
  'pisola-matsusaka-miyamachi',
  'pisola-moriyama-yoshimi',
  'pisola-tsu-fujikata',
  'pisola-yamatokoriyama',
  'pisola-handa',
  'babyface-planets-nishinomiya-oohama',
  'babyface-planets-okuradani',
  'babyface-planets-uji-ookubo',
  'babyface-planets-nabari',
  'pisola-neyagawa-horimizo',
  'pisola-sakai-senboku',
  'pisola-tarumi-gakuenminami',
  'pisola-suzuka-chuodori',
  'pisola-wakayama-mukai',
  'pisola-moriguchi-dainichi',
  'pisola-iwade',
  'pisola-hirakata-suyama',
  'pisola-kishidadou',
  'pisola-suita-esaka',
  'pisola-izumisano',
  'pisola-akashi-uozumi',
  'pisola-ibaraki-masago',
  'pisola-izumi-oda',
  'pisola-kyoto-katsura',
  'pisola-iruma-koyata',
  'pisola-sakai-ishihara',
  'pisola-sakai-asahigaoka',
  'pisola-yao-takami',
  'pisola-amagasaki-nishikoya',
  'pisola-takatsuki-otsuka',
  'pisola-himeji-hanada',
  'pisola-fussa',
  'pisola-nagoya-tangodori',
  'pisola-uji-ogura',
  'pisola-narita',
  'pisola-misato',
  'pisola-hachioji-nakano',
  'pisola-toyokawa-inter',
  'pisola-toyoyama',
  'pisola-yokosuka',
  'spice-theater',
  'segafredo',
  'kyotokatsugyu',
  'curry-no-nibantei',
  'fukushin',
  // deprecated: 'fukushin' に移行
  'fukushin-kita-akabane-ukima',
  // deprecated: 石神井公園店はMO廃止予定、その後消せる。
  'fukushin-shakujii-koen',
  'chigasaki-cafe',
  'single-o-japan',
  'ryumi',
  'taiyo-compass',
  'napoli-pizza',
] as const;

export type ProductionIdentifier = (typeof productionIdentifiers)[number];

// LIFFミニアプリ審査用に使う、Production 環境で DEMOモード = true の Tenant のID
// ※現状、1つのブランド（プロバイダー）を審査している間は、他のブランドは審査できないため注意。
const demoTenantUid = '8jDR1JOuPpkyZg24Ygw3';
// デモ用Tenantその2(1ブランドにつき1つTenantが必要なため増やした)
const demoTenantUid2 = 'xncRsMzO8bpqzgOo6txY';

const productionConfigs: Record<ProductionIdentifier, AppConfig> = {
  'chompy-demo': {
    // demoを行うときはこれをコピペして増やす
    tenantUidHeader: demoTenantUid,
    pageMeta: {
      title: 'PISOLA 豊川インター店',
      favicon: '/favicons/chompy-house.ico',
    },
    appColor: buildAppColor('#997525', '#8F6B1B'),
    liffId: '2006530706-WGRVZnz8',
  },
  'chompy-demo-2': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 豊山店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2006530718-exrb9K2p',
  },
  'chompy-demo-3': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 吹田江坂店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005110926-N3mM6qjk',
  },
  'chompy-demo-4': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 堺石原店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005107159-NWleKMr1',
  },
  'chompy-demo-5': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 堺泉北店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005107364-gqo4n8Y5',
  },
  'chompy-demo-6': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 尼崎西昆陽店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005111620-a9ZdARdD',
  },
  'chompy-demo-7': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 八尾高美店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005108010-3nmOd6mP',
  },
  'chompy-demo-8': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 堺旭ヶ丘店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005110903-Exon0PmZ',
  },
  'chompy-demo-9': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 鈴鹿中央通店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005111743-6kMvlqPr',
  },
  'chompy-demo-10': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 和泉小田店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005111907-8KWbQexm',
  },
  'chompy-demo-11': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 名古屋丹後通店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005111822-4NN6vkK8',
  },
  'chompy-demo-12': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 入間インター店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005648244-nvKgMbzE',
  },
  'chompy-demo-13': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 岩出店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005107827-l8J4QDM5',
  },
  'chompy-demo-14': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 和歌山向店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005111644-VB8B4MNx',
  },
  'chompy-demo-15': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 守口大日店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005108175-rj8A0WXx',
  },
  'chompy-demo-16': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 高槻大塚店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005107326-W4jXVKb0',
  },
  'chompy-demo-17': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 茨木真砂店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005106375-Wlj5lGBB',
  },
  'chompy-demo-18': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 垂水学園南店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005107408-yawozbzM',
  },
  'chompy-demo-19': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 枚方須山店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005107470-481wdkAM',
  },
  'chompy-demo-20': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 姫路花田店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005111672-y5jl0QGo',
  },
  'chompy-demo-21': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 明石魚住店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005100792-2BamlgDD',
  },
  'chompy-demo-22': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 岸田堂店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005107946-Qp5AxR1A',
  },
  'chompy-demo-23': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 宇治小倉店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005107527-pr3borK6',
  },
  'chompy-demo-24': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 寝屋川堀溝店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005107087-P6yoREdp',
  },
  'chompy-demo-25': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 京都桂店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005111777-wlry4j7b',
  },
  'chompy-demo-26': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'ベビーフェイスプラネッツ 宇治大久保店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005651224-mGjpKex8',
  },
  'chompy-demo-27': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'ベビーフェイスプラネッツ 大蔵谷店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005651281-gxL0Yb5m',
  },
  'chompy-demo-28': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'ベビーフェイスプラネッツ 名張店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005651292-NPEd8PrP',
  },
  'chompy-demo-29': {
    tenantUidHeader: demoTenantUid,
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'ベビーフェイスプラネッツ 西宮大浜店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005651298-OGP28kkp',
  },
  'chompy-demo-30': {
    tenantUidHeader: demoTenantUid2,
    appColor: buildAppColor('#1D0A80', '#130076'),
    pageMeta: {
      title: '福しん 北赤羽駅浮間口店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005764704-8vRDxqjJ',
  },
  'chompy-cafe': {
    tenantUidHeader: 'YXXmlkgoSU8hd0bYhaeD',
    appColor: buildAppColor('#AAAA32', '#A0A032'),
    pageMeta: {
      title: 'CHOMPY CAFE',
      favicon: '/favicons/chompy-house.ico',
    },
  },
  yellowcompany: {
    tenantUidHeader: 'XEj2xTTiMwg0crCISaBc',
    appColor: buildAppColor('#91442A', '#8B3A20'),
    pageMeta: {
      title: 'イエローカンパニー',
      favicon: '/favicons/yellowcompany.ico',
    },
    liffId: '1657603126-23dQg0eV',
  },
  'sandwich-store': {
    tenantUidHeader: '2c8xPcBcbqE54XGWmviu',
    appColor: buildAppColor('#D2691E', '#C85F14'),
    pageMeta: {
      title: 'Sandwich Store サンドイッチストア',
      favicon: '/favicons/sandwich-store.png',
    },
  },
  suage: {
    tenantUidHeader: 'tJf5Kn1G3NCYqNdOjH2T',
    appColor: buildAppColor('#D6001C', '#D3281A'),
    pageMeta: {
      title: 'Suage',
      favicon: '/favicons/suage.png',
    },
    liffId: '1657603130-8r6g5JzO',
  },
  'peoplewise-cafe': {
    tenantUidHeader: '4kfbuvToPUhqilhuEtKM',
    appColor: buildAppColor('#808080', '#767676'),
    pageMeta: {
      title: 'PEOPLEWISE CAFE',
      favicon: '/favicons/peoplewise-cafe.png',
    },
    liffId: '1657609994-4vMG273E',
  },
  'cafehall-ours': {
    tenantUidHeader: 'icWKkOlVMD77Lu05szzv',
    appColor: buildAppColor('#FF4500', '#F53100'),
    pageMeta: {
      title: 'CAFE&HALL ours',
      favicon: '/favicons/cafehall-ours.png',
    },
    liffId: '1657934696-GKazM2al',
  },
  'ghost-kitchens': {
    tenantUidHeader: 'HBkp0yZwcYKPCCKMFc8u',
    appColor: buildAppColor('#556056', '#474747'),
    pageMeta: {
      title: 'Ghost Kitchens',
      favicon: '/favicons/ghost-kitchens.png',
    },
  },
  'butter-steak-nakameguro': {
    tenantUidHeader: 'iAaI7HsyUOZCOe6OS6kl',
    appColor: buildAppColor('#854526', '#7B3B1C'),
    pageMeta: {
      title: 'ザ・バターステーキ 中目黒',
      favicon: '/favicons/butter-steak-nakameguro.png',
    },
  },
  'very-berry-soup': {
    tenantUidHeader: '2vUKQz8QNwsoK1qaAomP',
    appColor: buildAppColor('#000000', '#000000'),
    pageMeta: {
      title: 'ベリーベリースープ',
      favicon: '/favicons/very-berry-soup.png',
    },
  },
  'waseda-monsters-kitchen': {
    tenantUidHeader: 'rdUbTZZXdTDHnx20sp6A',
    appColor: buildAppColor('#800000', '#760000'),
    pageMeta: {
      title: '早稲田モンスターズキッチン',
      favicon: '/favicons/waseda-monsters-kitchen.png',
    },
  },
  'bricolage-bread': {
    tenantUidHeader: 'xJ4Huepi15kDs4ezfIm4',
    appColor: buildAppColor('#000000', '#000000'),
    pageMeta: {
      title: 'bricolage bread & co.',
      favicon: '/favicons/bricolage-bread.png',
    },
  },
  kenickcurry: {
    tenantUidHeader: 'FaipFLCB4iOZCrJFRtoW',
    appColor: buildAppColor('#000000', '#000000'),
    pageMeta: {
      title: 'ケニックカレー',
      favicon: '/favicons/kenickcurry.png',
    },
    liffId: '1657776052-5PQlXdzy',
  },
  'shirokuma-mikazuki': {
    tenantUidHeader: 'LzovGltGeW0aUCfif8Ct',
    appColor: buildAppColor('#A44F16', '#9A450C'),
    pageMeta: {
      title: 'シロクマ三日月珈琲',
      favicon: '/favicons/shirokuma-mikazuki.png',
    },
    liffId: '1657700465-3NPpbPPd',
  },
  amunt: {
    tenantUidHeader: 'JnBdFlCDA4V0NYzsGHex',
    appColor: buildAppColor('#B22222', '#A81818'),
    pageMeta: {
      title: 'スペイン料理 Amunt',
      favicon: '/favicons/amunt.png',
    },
  },
  bombomy: {
    tenantUidHeader: '3BOKRFIXN9jxlKNWWvL0',
    appColor: buildAppColor('#D2691E', '#C85F14'),
    pageMeta: {
      title: 'BOMBOMY',
      favicon: '/favicons/bombomy.png',
    },
  },
  sonma: {
    tenantUidHeader: 'qFXOIXl5jhiOgj6EoADF',
    appColor: buildAppColor('#A52A2A', '#9B2020'),
    pageMeta: {
      title: '韓国風創作居酒屋 Sonma',
      favicon: '/favicons/sonma.png',
    },
    liffId: '1657916501-G2NP4KR5',
  },
  'highball-nabe-chan': {
    tenantUidHeader: 'o64MsKS44Wq366nhBUSm',
    appColor: buildAppColor('#FF0000', '#F50000'),
    pageMeta: {
      title: '中華ハイボール酒場 なべちゃん',
      favicon: '/favicons/highball-nabe-chan.png',
    },
    liffId: '1660807343-kgZ48Q6e',
  },
  rairaiken: {
    tenantUidHeader: 'pyar62Eq1zCXwmc2Nsbo',
    appColor: buildAppColor('#FF0000', '#F50000'),
    pageMeta: {
      title: '来々軒',
      favicon: '/favicons/rairaiken.png',
    },
    liffId: '1660829914-ynAmPGkb',
  },
  upahar: {
    tenantUidHeader: 'oXHLXnyALZALMryTtu5s',
    appColor: buildAppColor('#FF4500', '#F53B00'),
    pageMeta: {
      title: 'アジアン料理＆バー ウパハール',
      favicon: '/favicons/upahar.png',
    },
    liffId: '1660835571-RqzaGLJ8',
  },
  'taiwan-cafe': {
    tenantUidHeader: 'HRfR4JH4GR2BHv0rlS5Z',
    appColor: buildAppColor('#FF0000', '#F50000'),
    pageMeta: {
      title: '台湾カフェ',
      favicon: '/favicons/taiwan-cafe.png',
    },
    liffId: '1660835753-Oy78gX5g',
  },
  kunyanpocha: {
    tenantUidHeader: 'eOExbmMyJrmIIt9h19Sf',
    appColor: buildAppColor('#FF0000', '#F50000'),
    pageMeta: {
      title: '韓国屋台式居酒屋クニャンポチャ',
      favicon: '/favicons/kunyanpocha.png',
    },
    liffId: '1660842324-KdoXYYl5',
  },
  thaispicy: {
    tenantUidHeader: 'Rq5C1fUDbRM0zlRqchDh',
    appColor: buildAppColor('#E57700', '#DB6D00'),
    pageMeta: {
      title: 'タイスパイシー',
      favicon: '/favicons/thaispicy.png',
    },
    liffId: '1660846889-oMDx5nw4',
  },
  mayarestaurant: {
    tenantUidHeader: 'dOIETHQdSrGSdTh2F6WH',
    appColor: buildAppColor('#FF0000', '#F50000'),
    pageMeta: {
      title: 'マヤレストラン',
      favicon: '/favicons/mayarestaurant.png',
    },
    liffId: '1660846748-2yW0QXxO',
  },
  'riverside-club': {
    tenantUidHeader: 'wwfMkSjLKGWd229aRcmm',
    appColor: buildAppColor('#FF1493', '#F50A89'),
    pageMeta: {
      title: 'RIVERSIDE CLUB',
      favicon: '/favicons/riverside-club.png',
    },
    liffId: '1660935018-4ojOqYDq',
  },
  ikinaristeak: {
    tenantUidHeader: 'wQwAvAIqkUt6vfoWKv4C',
    appColor: buildAppColor('#000000', '#000000'),
    pageMeta: {
      title: 'いきなりステーキ',
      favicon: '/favicons/ikinaristeak.png',
    },
    uiCustomization: {
      tenantHomeNoteText: '※一部の店舗ではご利用できません',
      isIkinariSteak: true,
    },
  },
  'ikinaristeak-prd-demo': {
    tenantUidHeader: 'ggI5YHFuf13K4jV73XhD',
    appColor: buildAppColor('#000000', '#000000'),
    pageMeta: {
      title: 'いきなりステーキ',
      favicon: '/favicons/ikinaristeak.png',
    },
    uiCustomization: {
      tenantHomeNoteText: '※一部の店舗ではご利用できません',
      isIkinariSteak: true,
    },
  },
  'healthy-hut': {
    tenantUidHeader: '64jOQXbcYkMRKTBl7ftA',
    appColor: buildAppColor('#E57700', '#DB7700'),
    pageMeta: {
      title: 'ヘルシーハット',
      favicon: '/favicons/healthy-hut.png',
    },
    liffId: '1661410238-1Zw9NaWr',
  },
  takobee: {
    tenantUidHeader: '7P2RBAIrnCLXu3iPOTN2',
    appColor: buildAppColor('#191970', '#0F1970'),
    pageMeta: {
      title: '蛸べえ',
      favicon: '/favicons/takobee.png',
    },
    liffId: '2000491981-LzOW5K8q',
  },
  'yurt-cafe-bbqpark': {
    tenantUidHeader: '7yYOR710QHwp6D3xEoFW',
    appColor: buildAppColor('#4682b4', '#3C82b4'),
    pageMeta: {
      title: 'YURT',
      favicon: '/favicons/yurt.png',
    },
    liffId: '2000595260-x36eZjmw',
  },
  spital: {
    tenantUidHeader: 'NwOWh4s5dLz7S9xTWw5X',
    appColor: buildAppColor('#008900', '#007F00'),
    pageMeta: {
      title: '筥崎荘々',
      favicon: '/favicons/spital.png',
    },
    liffId: '2000917564-pmPrMDN6',
  },
  'les-joues-de-bebe': {
    tenantUidHeader: 'A5P4YgyoFicxHZWxfgHZ',
    appColor: buildAppColor('#808080', '#767676'),
    pageMeta: {
      title: 'BeBe',
      favicon: '/favicons/les-joues-de-bebe.png',
    },
    liffId: '2001117327-gM05RpXP',
  },
  'shinsaibashi-mitsuya': {
    tenantUidHeader: 'eoRttFMTRIw1nfYU4U8z',
    appColor: buildAppColor('#F51934', '#F01934'),
    pageMeta: {
      title: '心斎橋ミツヤ',
      favicon: '/favicons/chompy-house.ico',
    },
  },
  frijoles: {
    tenantUidHeader: 'mOdMaOajvextEaMbOdKt',
    appColor: buildAppColor('#000000', '#000000'),
    pageMeta: {
      title: 'フリホーレス Frijoles ブリトー&タコス',
      favicon: '/favicons/frijoles.png',
    },
    liffId: '2001424046-5dLXpx6Y',
  },
  'nanas-green-tea': {
    tenantUidHeader: '13Et8MHQMPJYhjk1QsjR',
    appColor: buildAppColor('#000000', '#000000'),
    pageMeta: {
      title: 'ナナズグリーンティー',
      favicon: '/favicons/nanas-green-tea.png',
    },
    liffId: '2001719539-3zZRV21X',
  },
  'nanas-green-tea-chofu': {
    tenantUidHeader: '13Et8MHQMPJYhjk1QsjR',
    appColor: buildAppColor('#000000', '#000000'),
    pageMeta: {
      title: 'ナナズグリーンティー - 調布店',
      favicon: '/favicons/nanas-green-tea.png',
    },
    liffId: '2005466603-z5r9v4QJ',
  },
  nichijosahanji: {
    tenantUidHeader: 'Hn6OFOAcC9GIxydKA090',
    appColor: buildAppColor('#113961', '#073961'),
    pageMeta: {
      title: '日常茶飯時',
      favicon: '/favicons/nichijosahanji.png',
    },
    liffId: '2002329106-jl9aEdzm',
  },
  kitasandocoffee: {
    tenantUidHeader: 'z9BjNm5LLrbEETtjNu0E',
    appColor: buildAppColor('#696969', '#5F5F5F'), // TODO: 仮の色なので、後で実際のブランドカラーに変更する
    pageMeta: {
      title: 'KITASANDO COFFEE',
      // TODO: faviconを用意する
      favicon: '/favicons/chompy-house.ico',
    },
  },
  yousyusyonin: {
    tenantUidHeader: '0yFgQCZcGCvreKl3PL0Q',
    appColor: buildAppColor('#8c2c2c', '#822222'),
    pageMeta: {
      title: '中国ラーメン揚州商人',
      // TODO: faviconを用意する
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2004690405-jD64mVKK',
  },
  'dfs-shisui': {
    tenantUidHeader: 'SM5zel0eW3ABRgsCZP0l',
    appColor: buildAppColor('#FF0000', '#F50000'),
    pageMeta: {
      title: 'すしめん処 大京',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2006066028-9pm80ED7',
  },
  'pisola-demo': {
    // Production環境でのPISOLA様確認用
    tenantUidHeader: 'W1aJa0TdIgk45CpxCvTZ',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA',
      favicon: '/favicons/chompy-house.ico', // 仮のアイコンなので後で変更
    },
    liffId: '2005924052-RZJnvK03', // 開発用だけ使えれば良いので、開発用のLiffID。
  },
  pisola: {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA',
      favicon: '/favicons/chompy-house.ico', // 仮のアイコンなので後で変更
    },
    liffId: '2003390679-j9DzPk4o',
  },
  'pisola-otsukyo': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA - 大津京店',
      favicon: '/favicons/chompy-house.ico', // 仮のアイコンなので後で変更
    },
    liffId: '2004663249-eGoj1ga4',
  },
  'pisola-yokohama-hongodai': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA - 横浜本郷台店',
      favicon: '/favicons/chompy-house.ico', // 仮のアイコンなので後で変更
    },
    liffId: '2004665207-vLkyjx0Z',
  },
  'pisola-kuwana': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA - 桑名店',
      favicon: '/favicons/chompy-house.ico', // 仮のアイコンなので後で変更
    },
    liffId: '2005112091-OD7W1jgY',
  },
  'pisola-yamato-kamiwada': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA - 大和上和田店',
      favicon: '/favicons/chompy-house.ico', // 仮のアイコンなので後で変更
    },
    liffId: '2005111757-Nw3x76kK',
  },
  'pisola-yokkaichi-tokiwa': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA - 四日市ときわ店',
      favicon: '/favicons/chompy-house.ico', // 仮のアイコンなので後で変更
    },
    liffId: '2005111883-JkApYlAB',
  },
  'pisola-matsusaka-miyamachi': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA - 松阪宮町店',
      favicon: '/favicons/chompy-house.ico', // 仮のアイコンなので後で変更
    },
    liffId: '2005112033-MbQX08GR',
  },
  'pisola-moriyama-yoshimi': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA - 守山吉身店',
      favicon: '/favicons/chompy-house.ico', // 仮のアイコンなので後で変更
    },
    liffId: '2005108107-kyWr10Xy',
  },
  'pisola-tsu-fujikata': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA - 津藤方店',
      favicon: '/favicons/chompy-house.ico', // 仮のアイコンなので後で変更
    },
    liffId: '2005110966-R2jdXQr1',
  },
  'pisola-yamatokoriyama': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA - 大和郡山筒井店',
      favicon: '/favicons/chompy-house.ico', // 仮のアイコンなので後で変更
    },
    liffId: '2005106189-Bw3rDJap',
  },
  'pisola-handa': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA - 半田店',
      favicon: '/favicons/chompy-house.ico', // 仮のアイコンなので後で変更
    },
    liffId: '2005106300-eZlR0Ddv',
  },
  'babyface-planets-nishinomiya-oohama': {
    tenantUidHeader: '73H1doHe1Ts0d1XOociU',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'ベビーフェイスプラネッツ 西宮大浜店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005651299-MWWK0kka',
  },
  'babyface-planets-okuradani': {
    tenantUidHeader: '73H1doHe1Ts0d1XOociU',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'ベビーフェイスプラネッツ 大蔵谷店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005651282-j82Z61Pb',
  },
  'babyface-planets-uji-ookubo': {
    tenantUidHeader: '73H1doHe1Ts0d1XOociU',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'ベビーフェイスプラネッツ 宇治大久保店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005651225-7LryDY5z',
  },
  'babyface-planets-nabari': {
    tenantUidHeader: '73H1doHe1Ts0d1XOociU',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'ベビーフェイスプラネッツ 名張店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005651293-pzvVmW1l',
  },
  'pisola-neyagawa-horimizo': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 寝屋川堀溝店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005107088-D7edqRb5',
  },
  'pisola-sakai-senboku': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 堺泉北店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005107365-lBKqDNoo',
  },
  'pisola-tarumi-gakuenminami': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 垂水学園南店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005107410-dK5D2122',
  },
  'pisola-suzuka-chuodori': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 鈴鹿中央通店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005111744-7QO43jEG',
  },
  'pisola-wakayama-mukai': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 和歌山向店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005111645-o14M5jZ1',
  },
  'pisola-moriguchi-dainichi': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 守口大日店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005108176-3lrzgPee',
  },
  'pisola-iwade': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 岩出店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005107829-AJebY7MB',
  },
  'pisola-hirakata-suyama': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 枚方須山店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005107471-NVo4Ode9',
  },
  'pisola-kishidadou': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 岸田堂店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005107947-rVN9dez7',
  },
  'pisola-suita-esaka': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 吹田江坂店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005110927-RwybJo45',
  },
  'pisola-izumisano': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 泉佐野店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005107772-LqpmXGNe',
  },
  'pisola-akashi-uozumi': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 明石魚住店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005100794-5kpd7eOD',
  },
  'pisola-ibaraki-masago': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 茨木真砂店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005106376-DrdApM9l',
  },
  'pisola-izumi-oda': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 和泉小田店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005111908-jRgY1Ema',
  },
  'pisola-kyoto-katsura': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 京都桂店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005111778-mlxAe3gg',
  },
  'pisola-iruma-koyata': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 入間インター店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005648245-1ZVYp59Q',
  },
  'pisola-sakai-ishihara': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 堺石原店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005107160-qYPplOQP',
  },
  'pisola-sakai-asahigaoka': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 堺旭ヶ丘店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005110904-l4NnGv7B',
  },
  'pisola-yao-takami': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 八尾高美店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005108011-rjQEJkQP',
  },
  'pisola-amagasaki-nishikoya': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 尼崎西昆陽店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005111621-52eDzZDa',
  },
  'pisola-takatsuki-otsuka': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 高槻大塚店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005107327-gROBR0j6',
  },
  'pisola-himeji-hanada': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 姫路花田店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005111673-qloLXvKM',
  },
  'pisola-fussa': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 福生店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005112065-BDzmqgae',
  },
  'pisola-nagoya-tangodori': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 名古屋丹後通店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005111823-Eq1M2VGG',
  },
  'pisola-uji-ogura': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 宇治小倉店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005107528-p93gNPnO',
  },
  'pisola-narita': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 成田店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005923702-ZG16lxkj',
  },
  'pisola-misato': {
    tenantUidHeader: 'DHRJih5i3q9BFbF0RC1B',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'ピソラ三郷店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2006163352-oAYLOyBP',
  },
  'pisola-hachioji-nakano': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 八王子中野店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2006307662-GqZYZloa',
  },
  'pisola-toyokawa-inter': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 豊川インター店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2006530707-J73wz4XO',
  },
  'pisola-toyoyama': {
    tenantUidHeader: 'fQeZITIAeY7rfGTPYjGX',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 豊山店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2006530719-0zmadZRg',
  },
  'pisola-yokosuka': {
    tenantUidHeader: 'DHRJih5i3q9BFbF0RC1B', // FCテナント
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'PISOLA 横須賀店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2006693826-Dpp7V7VO',
  },
  'spice-theater': {
    tenantUidHeader: 'UslkVopUCYXlcy8BTuLN',
    appColor: buildAppColor('#5f9ea0', '#559496'),
    pageMeta: {
      title: 'Spice Theater',
      favicon: '/favicons/chompy-house.ico', // 仮のアイコンなので後で変更
    },
    liffId: '2003675139-1jybzXe8',
  },
  segafredo: {
    tenantUidHeader: '0eK3v49GFl4KDtfEpuqe',
    appColor: buildAppColor('#de2718', '#D41D0E'),
    pageMeta: {
      title: 'セガフレード・ザネッティ・エスプレッソ',
      favicon: '/favicons/chompy-house.ico', // TODO: 仮
    },
  },
  kyotokatsugyu: {
    tenantUidHeader: 'FSsOXOJPhQRCkuupEUUW',
    appColor: buildAppColor('#000000', '#000000'), // TODO: 仮
    pageMeta: {
      title: '牛カツ京都勝牛',
      favicon: '/favicons/chompy-house.ico', // TODO: 仮
    },
  },
  'curry-no-nibantei': {
    tenantUidHeader: 'hp4dvTBFBxpNVpAmogEP',
    appColor: buildAppColor('#a90e16', '#9F040C'),
    pageMeta: {
      title: 'カレーの弐番亭',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2004545152-pAnGRjY0',
  },
  fukushin: {
    tenantUidHeader: 'DHffO5XXqwCvQFUyfWzY',
    appColor: buildAppColor('#1D0A80', '#130076'),
    pageMeta: {
      title: '福しん',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005764705-gpKzd2WW',
  },
  'fukushin-kita-akabane-ukima': {
    tenantUidHeader: 'DHffO5XXqwCvQFUyfWzY',
    appColor: buildAppColor('#1D0A80', '#130076'),
    pageMeta: {
      title: '福しん 北赤羽駅浮間口店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005764705-gpKzd2WW',
  },
  'fukushin-shakujii-koen': {
    tenantUidHeader: 'DHffO5XXqwCvQFUyfWzY',
    appColor: buildAppColor('#1D0A80', '#130076'),
    pageMeta: {
      title: '福しん 石神井公園店',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2006019984-n37eAkQ7',
  },
  'chigasaki-cafe': {
    tenantUidHeader: 'YXXmlkgoSU8hd0bYhaeD',
    appColor: buildAppColor('#997525', '#8F6B1B'),
    pageMeta: {
      title: 'Chigasaki Cafe',
      favicon: '/favicons/chompy-house.ico',
    },
    liffId: '2005916580-j0rzMRAM', // 開発用のLiffID
  },
  'single-o-japan': {
    tenantUidHeader: '7TTCTqxsm3G5QQEuO8W2',
    appColor: buildAppColor('#f56600', '#f56600'),
    pageMeta: {
      title: 'Single O Japan',
      favicon: '/favicons/single-o-japan.png',
    },
  },
  ryumi: {
    tenantUidHeader: '8Y4G1DqB2JORjhmWFqJM',
    appColor: buildAppColor('#FF0000', '#F50000'),
    pageMeta: {
      title: '元祖“名古屋中華“龍美',
      favicon: '/favicons/chompy-house.ico',
    },
  },
  'taiyo-compass': {
    tenantUidHeader: 'rjHYEXrjMPiHyfxlhm7u',
    appColor: buildAppColor('#58504C', '#4E4642'),
    pageMeta: {
      title: '太陽コンパス',
      favicon: '/favicons/chompy-house.ico',
    },
  },
  'napoli-pizza': {
    tenantUidHeader: 'f3yVbk7dPOhPr0evtclp',
    appColor: buildAppColor('#A31616', '#990C0C'),
    pageMeta: {
      title: 'ナポリの窯',
      favicon: '/favicons/napoli-pizza.png',
    },
    firebaseAuthProject: 'napoli-pizza',
    promotionEnabled: true,
  },
} as const;

export const productionApps = makeAppDefinition(productionIdentifiers, productionConfigs);
