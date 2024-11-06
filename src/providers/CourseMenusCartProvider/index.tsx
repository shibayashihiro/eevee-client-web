import { createContext, Dispatch, useContext, useReducer } from 'react';

type CourseMenusCart = {
  entryIds: string[];
  byEntryId: {
    [key: string]: CourseMenusCartItem;
  };
  rule: CourseMenuRule | null;
};

export type CourseMenuRule = {
  title: string;
  descriptions: string[];
};

export type CourseMenusCartItem = {
  courseMenuId: string;
  courseMenuName: string;
  courseMenuEntryId: string;
  courseMenuEntryName: string;
  price: number;
  quantity: number;
};

const courseMenusCartContext = createContext<CourseMenusCart | null>(null);
const courseMenusCartDispatchContext = createContext<Dispatch<Action> | null>(null);

export const useCourseMenusCart = () => {
  const state = useContext(courseMenusCartContext);
  if (state === null) {
    throw new Error('useCourseMenusCart must be used within a CourseMenusCartProvider');
  }
  return state;
};

export const useCourseMenusCartDispatch = () => {
  const dispatch = useContext(courseMenusCartDispatchContext);
  if (dispatch === null) {
    throw new Error('useCourseMenusCartDispatch must be used within a CourseMenusCartProvider');
  }
  return dispatch;
};

export const CourseMenusCartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  return (
    <courseMenusCartContext.Provider value={cart}>
      <courseMenusCartDispatchContext.Provider value={dispatch}>{children}</courseMenusCartDispatchContext.Provider>
    </courseMenusCartContext.Provider>
  );
};

type PutItemsAction = {
  type: 'PUT_ITEMS';
  items: CourseMenusCartItem[];
};

type RemoveItemAction = {
  type: 'REMOVE_ITEM';
  courseMenuId: string;
  courseMenuEntryId: string;
};

// 新しくコースの選択を開始する。カートをクリアして、新しいルールをセットする。
type StartCourseMenuSelectAction = {
  type: 'START_COURSE_MENU_SELECT';
  rule: CourseMenuRule;
};

type ClearCartAction = {
  type: 'CLEAR_CART';
};

type Action = PutItemsAction | RemoveItemAction | ClearCartAction | StartCourseMenuSelectAction;

const cartReducer = (state: CourseMenusCart, action: Action): CourseMenusCart => {
  switch (action.type) {
    case 'PUT_ITEMS': {
      return putItems(state, action.items);
    }
    case 'REMOVE_ITEM': {
      return removeItem(state, action.courseMenuEntryId);
    }
    case 'CLEAR_CART': {
      return { ...initialState };
    }
    case 'START_COURSE_MENU_SELECT': {
      return {
        ...initialState,
        rule: action.rule,
      };
    }
    default:
      return state;
  }
};

const initialState: CourseMenusCart = {
  entryIds: [],
  byEntryId: {},
  rule: null,
};

const putItem = (state: CourseMenusCart, item: CourseMenusCartItem): CourseMenusCart => {
  const isExisting = !!state.byEntryId[item.courseMenuEntryId];
  return {
    ...state,
    byEntryId: {
      ...state.byEntryId,
      [item.courseMenuEntryId]: item,
    },
    entryIds: isExisting ? state.entryIds : [...state.entryIds, item.courseMenuEntryId],
  };
};

// この関数を利用しても、context内のstateは更新されないため注意。
// 「（すぐに）注文をはじめる」場合に、stateのライフサイクルとは別に、入力中のItemとstateのItemをマージしたいためにexportしている。
export const putItems = (state: CourseMenusCart, items: CourseMenusCartItem[]): CourseMenusCart => {
  return items.reduce<CourseMenusCart>((acc, item) => {
    if (item.quantity <= 0) {
      return removeItem(acc, item.courseMenuEntryId);
    }
    return putItem(acc, item);
  }, state);
};

const removeItem = (state: CourseMenusCart, courseMenuEntryId: string): CourseMenusCart => {
  const { [courseMenuEntryId]: _, ...byEntryId } = state.byEntryId;
  return {
    ...state,
    byEntryId,
    entryIds: state.entryIds.filter((entryId) => entryId !== courseMenuEntryId),
  };
};

export const selectCartItems = (state: CourseMenusCart) => state.entryIds.map((entryId) => state.byEntryId[entryId]);

/**
 * 有料のカートアイテムのみを取得する
 */
export const selectPaidCartItems = (state: CourseMenusCart) => selectCartItems(state).filter((item) => item.price > 0);

export const selectCartItemsTotalPrice = (state: CourseMenusCart) =>
  selectCartItems(state).reduce((acc, item) => acc + item.price * item.quantity, 0);
