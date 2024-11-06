import { createContext, useContext, useReducer } from 'react';

import {
  InitialOrderItemForCartItemEditFragment,
  MenuItemForCartItemEditPartsFragment,
} from './CartItemEdit.fragment.generated';
import { Action, init, reducer, State } from './reducer';

type Props = {
  menuItem: MenuItemForCartItemEditPartsFragment;
  initialOrderItem?: InitialOrderItemForCartItemEditFragment | null;
  children: React.ReactNode;
};

export const CartItemEditContext = createContext<State | null>(null);
export const CartItemEditDispatchContext = createContext<React.Dispatch<Action> | null>(null);

export const useCartItemEditState = () => {
  const context = useContext(CartItemEditContext);
  if (!context) {
    throw new Error('useCartItemEditState must be used within a CartItemEditProvider');
  }
  return context;
};

export const useCartItemEditDispatch = () => {
  const context = useContext(CartItemEditDispatchContext);
  if (!context) {
    throw new Error('useCartItemEditDispatch must be used within a CartItemEditProvider');
  }
  return context;
};

export const CartItemEditProvider = ({ menuItem, initialOrderItem, children }: Props) => {
  const initializeProps = { menuItem, initialOrderItem };
  const [state, dispatch] = useReducer(reducer, initializeProps, init);

  return (
    <CartItemEditContext.Provider value={state}>
      <CartItemEditDispatchContext.Provider value={dispatch}>{children}</CartItemEditDispatchContext.Provider>
    </CartItemEditContext.Provider>
  );
};
