import { OrderType } from '@/graphql/generated/types';

import { ActionType, FormInputNames } from './provider';

export type UserInfoInputItem = {
  /**
   * Label
   */
  label: string;

  /**
   * 「ご注文に関してご連絡することがございます〜」の文章中に表示する名前
   */
  nameInNotice: string;

  /**
   * input type
   */
  type: string;
  /**
   * input name
   */
  name: FormInputNames;
  /**
   * autocomplete
   */
  autocomplete: string;
  /**
   * placeholder
   */
  placeholder: string;

  /**
   * stateの更新をdispatchするときのactionType
   */
  actionType: Exclude<ActionType, 'SET_ERROR'>;
};

/**
 * 入力項目の仕様
 * ----------------------------------------
 *
 * デリバリーの場合
 *   お名前 のみ(デリバリーはログイン前提のため)
 * テイクアウトの場合
 *   いきなりステーキさま : お名前、電話番号、メールアドレス
 *   LINEミニアプリ     : お名前、電話番号
 *   WEB(非ログイン時)  : お名前、電話番号
 *   WEB(ログイン時)    : お名前
 */ export const getFormItems = ({
  isIkinariSteak,
  orderType,
  isLIFF,
  isAnonymous,
}: {
  isIkinariSteak: boolean;
  orderType: OrderType;
  isLIFF: boolean;
  isAnonymous: boolean;
}) => {
  if (isIkinariSteak) {
    // いきなりステーキさまは特別な表示仕様。
    return ikinariSteakItems;
  }
  switch (orderType) {
    case OrderType.Delivery:
      return [familyNameItem];
    case OrderType.Takeout:
      if (isLIFF || isAnonymous) {
        return [familyNameItem, phoneNumberItem];
      }
      return [familyNameItem];
    default:
      return [];
  }
};

const familyNameItem: UserInfoInputItem = {
  label: 'お名前（カナ）',
  nameInNotice: 'お名前',
  type: 'text',
  name: 'familyNameKana',
  autocomplete: 'family-name',
  placeholder: 'ヤマダ',
  actionType: 'SET_FAMILY_NAME_KANA',
} as const;
const phoneNumberItem: UserInfoInputItem = {
  label: 'お電話番号',
  nameInNotice: 'お電話番号',
  type: 'tel',
  name: 'phoneNumber',
  autocomplete: 'tel',
  placeholder: '09000000000',
  actionType: 'SET_PHONE_NUMBER',
} as const;
const emailItem: UserInfoInputItem = {
  label: 'メールアドレス',
  nameInNotice: 'メールアドレス',
  type: 'email',
  name: 'email',
  autocomplete: 'email',
  placeholder: 'example@domain.com',
  actionType: 'SET_EMAIL',
} as const;

const ikinariSteakItems: UserInfoInputItem[] = [familyNameItem, phoneNumberItem, emailItem] as const;
