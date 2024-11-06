import { useDisclosure } from '@chakra-ui/react';
import { createContext, useCallback, useContext, useMemo, useReducer, useState } from 'react';

import { selectSelectedOptionItem, useCartItemEditState } from '@/providers/CartItemEditProvider';
import {
  State as OptionsState,
  initialState as initialOptionsState,
  reducer,
  Action as OptionsAction,
  SetSubOptionItemsAction,
  SetSubOptionItemsWithinOptionAction,
} from '@/utils/domain/selectMenuOptionsReducer';

import { OptionItemSubOptionEditDialog } from './OptionItemSubOptionEditDialog';
import { OptionItemSubOptionEditDialogPartsFragment } from './OptionItemSubOptionEditDialog.fragment.generated';

export type OptionItemSubOptionEditDialogState = {
  isOpen: boolean;
  viewingItem: ViewingItem | null;

  options: OptionsState;
};

type ViewingItem = {
  optionId: string;
  item: OptionItemSubOptionEditDialogPartsFragment;
};

// サブオプションのサブオプションはサポートしないため実装ミスを防ぐため除外
type Action = Exclude<OptionsAction, SetSubOptionItemsAction | SetSubOptionItemsWithinOptionAction>;

type OptionItemSubOptionEditDialogDispatchers = {
  onOpen: (optionId: string, optionItem: OptionItemSubOptionEditDialogPartsFragment) => void;
  onClose: () => void;

  dispatch: React.Dispatch<Action>;
};

const SubOptionEditDialogContext = createContext<OptionItemSubOptionEditDialogState | undefined>(undefined);
const SubOptionEditDialogDispatchContext = createContext<OptionItemSubOptionEditDialogDispatchers | undefined>(
  undefined,
);

// ネストしたコンポーネントからSubOptionEditDialogを表示・非表示できるようにするためのProvider
export const OptionItemSubOptionEditDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [viewingItem, setViewingItem] = useState<ViewingItem | null>(null);

  // レンダリング時点では初期値が決まらない(ダイアログを開くまで決まらない)ためinitializerではなく初期値を固定で渡す
  const [options, dispatchOptions] = useReducer(reducer, initialOptionsState);

  const cartItemEditState = useCartItemEditState();

  const state: OptionItemSubOptionEditDialogState = useMemo(
    () => ({
      isOpen,
      viewingItem,
      options,
    }),
    [isOpen, options, viewingItem],
  );

  const handleOpen = useCallback(
    (optionId: string, optionItem: OptionItemSubOptionEditDialogPartsFragment) => {
      const cartSelectedItem = selectSelectedOptionItem(cartItemEditState, optionItem.id);
      setViewingItem({
        optionId,
        item: optionItem,
      });
      dispatchOptions({
        type: 'INITIALIZE',
        payload: {
          options: optionItem.subOptions,
          initialOptions: cartSelectedItem?.subOptionItems ?? [],
        },
      });
      onOpen();
    },
    [cartItemEditState, onOpen],
  );

  const handleClose = useCallback(() => {
    setViewingItem(null);
    dispatchOptions({ type: 'CLEAR' });
    onClose();
  }, [onClose]);

  const dispatchers = useMemo(
    () => ({
      onOpen: handleOpen,
      onClose: handleClose,
      dispatch: dispatchOptions,
    }),
    [handleClose, handleOpen],
  );

  return (
    <SubOptionEditDialogContext.Provider value={state}>
      <SubOptionEditDialogDispatchContext.Provider value={dispatchers}>
        {children}
        <OptionItemSubOptionEditDialog />
      </SubOptionEditDialogDispatchContext.Provider>
    </SubOptionEditDialogContext.Provider>
  );
};

// NOTE: これはダイアログの中でしか利用しない（外部に公開しない）
export const useOptionItemSubOptionEditDialogState = (): OptionItemSubOptionEditDialogState => {
  const state = useContext(SubOptionEditDialogContext);
  if (!state) {
    throw new Error(
      'useOptionItemSubOptionEditDialogState must be used within a OptionItemSubOptionEditDialogProvider',
    );
  }
  return state;
};

export const useOptionItemSubOptionEditDialog = (): OptionItemSubOptionEditDialogDispatchers => {
  const dispatchers = useContext(SubOptionEditDialogDispatchContext);
  if (!dispatchers) {
    throw new Error('useOptionItemSubOptionEditDialog must be used within a OptionItemSubOptionEditDialogProvider');
  }
  return dispatchers;
};
