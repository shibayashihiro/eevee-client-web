import { createContext, ReactNode, useContext, useReducer } from 'react';
import liff from '@line/liff';

import { validateEmail, validateKana, validatePhoneNumber } from '@/utils/validator';
import { useAuthUser } from '@/auth/provider/AuthUserProvider';
import { useUICustomization } from '@/providers/tenant/WebOrderPageStateProvider';
import { OrderType } from '@/graphql/generated/types';
import { fromJpPhoneNumber } from '@/utils/formatUtils';

import { getFormItems, UserInfoInputItem } from './formItem';

type FormState = {
  email: string;
  phoneNumber: string;
  familyNameKana: string;

  /**
   * 入力項目のリスト(動的に決まる)
   */
  formItems: UserInfoInputItem[];
  /**
   * エラーがある場合はエラーメッセージを格納する
   */
  errors?: Partial<{ [key in FormInputNames]: string | null }>;
};

export type FormInputNames = Exclude<keyof FormState, 'errors' | 'formItems'>;

type InputValuesState = Record<FormInputNames, string>;

/**
 * エラーがある場合はエラーメッセージを返す。エラーがなければnullを返す
 */
export const errorMessage = (state: FormState, name: FormInputNames): string | null => {
  switch (name) {
    case 'email':
      if (!validateEmail(state.email)) {
        return '有効なメールアドレスを入力してください。';
      } else {
        return null;
      }
    case 'phoneNumber':
      if (!validatePhoneNumber(state.phoneNumber)) {
        return '有効な電話番号を入力してください。';
      } else {
        return null;
      }
    case 'familyNameKana':
      if (!validateKana(state.familyNameKana)) {
        return 'カナで入力してください。';
      } else {
        return null;
      }
    default:
      return null;
  }
};

type FormAction =
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PHONE_NUMBER'; payload: string }
  | { type: 'SET_FAMILY_NAME_KANA'; payload: string }
  | { type: 'SET_ERROR'; payload: { name: FormInputNames; message: string | null } };

export type ActionType = FormAction['type'];

export const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_EMAIL':
      return {
        ...state,
        email: action.payload,
      };
    case 'SET_PHONE_NUMBER':
      return {
        ...state,
        phoneNumber: action.payload,
      };
    case 'SET_FAMILY_NAME_KANA':
      return {
        ...state,
        familyNameKana: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.name]: action.payload.message,
        },
      };
    default:
      return state;
  }
};

const defaultValues: InputValuesState = {
  email: '',
  phoneNumber: '',
  familyNameKana: '',
};

// State用とDispatch用に別々のContextを作成
const FormStateContext = createContext<FormState | undefined>(undefined);
const FormDispatchContext = createContext<React.Dispatch<FormAction> | undefined>(undefined);

type Props = {
  children: ReactNode;
  orderType: OrderType;
  initialState?: Partial<InputValuesState>;
};

export const CartUserInfoFormProvider = ({ children, orderType, initialState }: Props) => {
  const { isAnonymous } = useAuthUser();
  const uiCustom = useUICustomization();
  const formItems = getFormItems({
    orderType,
    isLIFF: liff.isInClient(),
    isAnonymous,
    isIkinariSteak: uiCustom?.isIkinariSteak ?? false,
  });
  const initialInputState = {
    ...defaultValues,
    ...initialState,
  };
  initialInputState.phoneNumber = fromJpPhoneNumber(initialInputState.phoneNumber);
  const [state, dispatch] = useReducer(formReducer, { ...initialInputState, formItems });

  return (
    <FormStateContext.Provider value={state}>
      <FormDispatchContext.Provider value={dispatch}>{children}</FormDispatchContext.Provider>
    </FormStateContext.Provider>
  );
};

export const useCartUserInfoFormState = () => {
  const context = useContext(FormStateContext);
  if (context === undefined) {
    throw new Error('useFormState must be used within a FormProvider');
  }
  return context;
};

export const useCartUserInfoFormDispatch = () => {
  const context = useContext(FormDispatchContext);
  if (context === undefined) {
    throw new Error('useFormDispatch must be used within a FormProvider');
  }
  return context;
};

/**
 * 入力フォームにエラーがある場合はtrueを返す
 */
export const hasError = (state: FormState): boolean => {
  // 全部の表示項目がvalidだったらOK
  return state.formItems.some((item) => !!errorMessage(state, item.name));
};
