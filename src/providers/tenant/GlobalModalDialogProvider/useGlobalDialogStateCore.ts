import { useReducer, useCallback } from 'react';

export type State = {
  title: string;
  message: string;
  isShow: boolean;
  dialogOptions?: DialogOptions;
};

export type DialogOptions = {
  closeButtonText?: string;
  closeButtonVariant?: 'primary' | 'secondary';
  onCloseCallback?: () => void;
};

type ShowDialogAction = {
  type: 'SHOW';
  payload: {
    title: string;
    message: string;
    options?: DialogOptions;
  };
};

type HideDialogAction = {
  type: 'HIDE';
};

type Action = ShowDialogAction | HideDialogAction;

const init = (initialState?: Partial<State>): State => ({
  title: '',
  message: '',
  isShow: false,
  ...initialState,
});

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SHOW':
      return {
        ...state,
        title: action.payload.title,
        message: action.payload.message,
        isShow: true,
        dialogOptions: action.payload.options,
      };
    case 'HIDE':
      return init();
    default:
      throw new Error('unknown action type');
  }
};

/**
 * @param initialState - テスト用に外から注入可能にしている
 */
export const useGlobalModalDialogStateCore = (initialState?: Partial<State>) => {
  const [state, dispatch] = useReducer(reducer, init(initialState));

  const show = useCallback((title: string, message: string, options?: DialogOptions) => {
    dispatch({
      type: 'SHOW',
      payload: {
        title,
        message,
        options,
      },
    });
  }, []);

  const hide = useCallback(() => {
    dispatch({
      type: 'HIDE',
    });
  }, []);

  return {
    state,
    show,
    hide,
  } as const;
};
