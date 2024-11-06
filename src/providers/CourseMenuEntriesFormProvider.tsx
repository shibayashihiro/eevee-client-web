import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { CourseMenusCartItem } from './CourseMenusCartProvider';

type State = {
  // カートに追加するときに、CourseMenuEntryのマスタデータが必要なので、ここで保持する
  entryMaster: CourseMenuEntryMaster;
  // quantityById: { [key: string]: number };
  quantityById: {
    // MenuId: EntryId: Quantity のMap
    [key: string]: {
      [key: string]: number;
    };
  };

  // 以下はValidation用途
  minSelectCountByCourseMenuId: {
    [key: string]: number;
  };
  errorByCourseMenuId: {
    [key: string]: string;
  };
};

type CourseMenuEntryMaster = {
  // MenuId: { EntryId: Entry } のMap
  [key: string]: {
    [key: string]: CourseMenuEntryMasterItem;
  };
};

export type CourseMenuEntryMasterItem = {
  id: string;
  name: string;
  price: number;
  courseMenuId: string;
  courseMenuName: string;
  courseMenuMinSelectCount: number;
  initialQuantity?: number;
};

type FormStateDispatch = {
  setQuantity: (courseMenuId: string, entryId: string, quantity: number) => void;
  validate: () => boolean;
};

const courseMenuSelectPeopleFormContext = createContext<State | null>(null);
const courseMenuSelectPeopleFormDispatchContext = createContext<FormStateDispatch | null>(null);

export const useCourseMenuEntriesForm = () => {
  const state = useContext(courseMenuSelectPeopleFormContext);
  if (state === null) {
    throw new Error('useCourseMenuSelectPeopleFormState must be used within a CourseMenuSelectPeopleFormProvider');
  }
  return state;
};

export const useCourseMenuEntriesFormDispatch = () => {
  const dispatch = useContext(courseMenuSelectPeopleFormDispatchContext);
  if (dispatch === null) {
    throw new Error('useCourseMenuSelectPeopleFormDispatch must be used within a CourseMenuSelectPeopleFormProvider');
  }
  return dispatch;
};

type Props = {
  children: ReactNode;
  courseMenuEntries: CourseMenuEntryMasterItem[];
};

export const CourseMenuEntriesFormProvider = ({ children, courseMenuEntries }: Props) => {
  const [state, setState] = useState<State>(() => initializeFormState(courseMenuEntries));

  const setQuantity = useCallback((courseMenuId: string, entryId: string, quantity: number) => {
    setState((prevState) => {
      const newQuantityById = { ...prevState.quantityById };
      if (!newQuantityById[courseMenuId]) {
        newQuantityById[courseMenuId] = {};
      }
      newQuantityById[courseMenuId][entryId] = quantity;
      return { ...prevState, quantityById: newQuantityById };
    });
  }, []);

  const validate = useCallback(() => {
    const newErrorByCourseMenuId: { [key: string]: string } = {};
    Object.entries(state.minSelectCountByCourseMenuId).forEach(([courseMenuId, minSelectCount]) => {
      const selectedCount = Object.values(state.quantityById[courseMenuId] ?? {}).reduce((acc, quantity) => {
        return acc + quantity;
      }, 0);
      if (selectedCount < minSelectCount) {
        newErrorByCourseMenuId[courseMenuId] = errorMinSelectCountMessage(minSelectCount);
      }
    });
    setState((prevState) => {
      return { ...prevState, errorByCourseMenuId: newErrorByCourseMenuId };
    });
    return Object.values(newErrorByCourseMenuId).length === 0;
  }, [state.minSelectCountByCourseMenuId, state.quantityById]);

  const dispatch = useMemo(() => {
    return { setQuantity, validate };
  }, [setQuantity, validate]);

  return (
    <courseMenuSelectPeopleFormContext.Provider value={state}>
      <courseMenuSelectPeopleFormDispatchContext.Provider value={dispatch}>
        {children}
      </courseMenuSelectPeopleFormDispatchContext.Provider>
    </courseMenuSelectPeopleFormContext.Provider>
  );
};

export const initializeFormState = (entries: CourseMenuEntryMasterItem[]): State => {
  const entryMaster: CourseMenuEntryMaster = {};
  const quantityById: {
    [key: string]: {
      [key: string]: number;
    };
  } = {};
  const minSelectCountByCourseMenuId: {
    [key: string]: number;
  } = {};

  for (const entry of entries) {
    entryMaster[entry.courseMenuId] = {
      ...entryMaster[entry.courseMenuId],
      [entry.id]: entry,
    };
    if (!quantityById[entry.courseMenuId]) {
      quantityById[entry.courseMenuId] = {};
    }
    if (entry.initialQuantity) {
      quantityById[entry.courseMenuId][entry.id] = entry.initialQuantity;
    }
    minSelectCountByCourseMenuId[entry.courseMenuId] = entry.courseMenuMinSelectCount;
  }
  return { entryMaster, quantityById, minSelectCountByCourseMenuId, errorByCourseMenuId: {} };
};

// Selector
export const selectSelectedEntriesAsCartItem = (state: State): CourseMenusCartItem[] => {
  return Object.entries(state.quantityById).flatMap<CourseMenusCartItem>(([courseMenuId, entries]) => {
    return Object.entries(entries).map(([entryId, quantity]) => {
      const entry = state.entryMaster[courseMenuId][entryId];
      return {
        courseMenuId,
        courseMenuName: entry.courseMenuName,
        courseMenuEntryId: entryId,
        courseMenuEntryName: entry.name,
        price: entry.price,
        quantity,
      };
    });
  });
};

// errors
const errorMinSelectCountMessage = (minSelectCount: number) => `${minSelectCount}人以上選択してください`;
