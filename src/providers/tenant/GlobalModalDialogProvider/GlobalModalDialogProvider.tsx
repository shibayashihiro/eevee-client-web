import { createContext, FC, useContext } from 'react';

import { GlobalModalDialog } from './GlobalModalDialog';
import { DialogOptions, State, useGlobalModalDialogStateCore } from './useGlobalDialogStateCore';

type Dispatches = {
  show: (title: string, message: string, options?: DialogOptions) => void;
  hide: () => void;
};

const GlobalModalDialogStateContext = createContext<State | undefined>(undefined);
const GlobalModalDialogDispatchContext = createContext<Dispatches | undefined>(undefined);

export const useGlobalModalDialogState = (): State => {
  const ctx = useContext(GlobalModalDialogStateContext);
  if (!ctx) {
    throw new Error('GlobalModalDialogStateContext is not initialized');
  }
  return ctx;
};

export const useGlobalModalDialogDispatch = (): Dispatches => {
  const ctx = useContext(GlobalModalDialogDispatchContext);
  if (!ctx) {
    throw new Error('GlobalModalDialogDispatchContext is not initialized');
  }
  return ctx;
};

type Props = {
  children: React.ReactNode;
  initialState?: Partial<State>;
};

export const GlobalDialogProvider: FC<Props> = (props) => {
  const { state, show, hide } = useGlobalModalDialogStateCore(props.initialState);
  return (
    <GlobalModalDialogStateContext.Provider value={state}>
      <GlobalModalDialogDispatchContext.Provider value={{ show, hide }}>
        {props.children}
        <GlobalModalDialog />
      </GlobalModalDialogDispatchContext.Provider>
    </GlobalModalDialogStateContext.Provider>
  );
};
