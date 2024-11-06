import { Modal, ModalOverlay, Spinner } from '@chakra-ui/react';
import { createContext, FC, useContext, useEffect, useState } from 'react';

const GlobalLoadingSpinnerStateContext = createContext<boolean>(false);
const GlobalLoadingSpinnerDispatchContext = createContext<((loading: boolean) => void) | undefined>(undefined);

export const useGlobalLoadingSpinnerState = (): boolean => {
  const ctx = useContext(GlobalLoadingSpinnerStateContext);
  if (ctx === undefined) {
    throw new Error('GlobalLoadingSpinnerProvider is not initialized');
  }
  return ctx;
};

export const useGlobalLoadingSpinnerDispatch = (): ((loading: boolean) => void) => {
  const ctx = useContext(GlobalLoadingSpinnerDispatchContext);
  if (ctx === undefined) {
    throw new Error('GlobalLoadingSpinnerProvider is not initialized');
  }
  return ctx;
};

export const useLoadingOverlay = (loading: boolean): void => {
  const setLoading = useGlobalLoadingSpinnerDispatch();

  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);
};

export const ModalOverlaySpinner: FC<{
  show: boolean;
}> = ({ show }) => (
  <Modal
    onClose={() => {
      return;
    }}
    isOpen={show}
  >
    <ModalOverlay bg="rgba(0,0,0,0.4)" display="grid" gridColumn="1" alignItems="Center" justifyContent="Center">
      <Spinner className="mono-primary" />
    </ModalOverlay>
  </Modal>
);

type Props = {
  children: React.ReactNode;
};

export const GlobalLoadingSpinnerProvider: FC<Props> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  return (
    <GlobalLoadingSpinnerStateContext.Provider value={loading}>
      <GlobalLoadingSpinnerDispatchContext.Provider value={setLoading}>
        <ModalOverlaySpinner show={loading} />
        {children}
      </GlobalLoadingSpinnerDispatchContext.Provider>
    </GlobalLoadingSpinnerStateContext.Provider>
  );
};
