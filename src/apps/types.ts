import { ColorPalette, RGBA } from '@/utils/color';
import { FirebaseAuthProject } from '@/auth';

export type { AppIdentifier } from './data/index';

export type AppDefinition<T extends string> = {
  identifiers: readonly T[];
  configs: Record<T, AppConfig>;
  getConfig(identifier: string): AppConfig | null;
};

export type AppConfig = {
  tenantUidHeader: string;
  appColor: AppColor;
  pageMeta: PageMeta;
  uiCustomization?: UICustomization;
  /**
   * LIFFアプリID。Developper ConsoleのLIFFの、環境ごとに異なるURLのパス部分。
   */
  liffId?: string;
  /**
   * 独自ID利用時に、Firebase Authのプロジェクトを指定する。指定しない場合はデフォルトのプロジェクトを利用する。
   */
  firebaseAuthProject?: FirebaseAuthProject;
  /**
   * 中規模UIモードに変更するためのフラグ。trueの場合、中規模UIモードに変更する。
   */
  promotionEnabled?: boolean;
};

export type AppColor = {
  primaryColor: RGBA;
  primaryTextColor: RGBA;
  backgroundColor: RGBA;
  backgroundSoftColor: RGBA;
  colorPalette: ColorPalette;
};

type PageMeta = {
  title: string;
  favicon: string;
};

// Tenant別に、個別にUIを変更したい場合の設定
export type UICustomization = {
  // テナントホーム画面の注意書き（いきなりステーキさま向けに追加: https://chompy-inc.slack.com/archives/C021QNPTXDX/p1697447351970879 )
  tenantHomeNoteText?: string;

  // いきなりステーキさま向けの特別仕様が多いので追加
  isIkinariSteak?: boolean;
};
