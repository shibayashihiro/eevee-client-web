import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

export const steps = {
  inputPhoneNumber: 'inputPhoneNumber',
  inputAuthorizationCode: 'inputAuthorizationCode',
  inputCredentials: 'inputCredentials',
  inputUserInfo: 'inputUserInfo',
  completed: 'completed',
} as const;

export type SignUpStep = (typeof steps)[keyof typeof steps];

const visibleSteps: SignUpStep[] = [
  steps.inputPhoneNumber,
  steps.inputAuthorizationCode,
  steps.inputCredentials,
  steps.inputUserInfo,
  steps.completed,
] as const;

export const initialStep = visibleSteps[0];

type StepperState = {
  activeStep: SignUpStep;
};

type StepperDispatch = {
  goToNextStep: () => void;
  goToPrevStep: () => void;
  goToCompleted: () => void;
};

const StepperStateContext = createContext<StepperState | undefined>(undefined);
const StepperDispatchContext = createContext<StepperDispatch | undefined>(undefined);

export const StepperProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeStep, setActiveStep] = useState<SignUpStep>(initialStep);

  const goToNextStep = () => {
    setActiveStep((step) => {
      const nextIndex = visibleSteps.indexOf(step) + 1;
      if (nextIndex >= visibleSteps.length) {
        return step;
      }
      return visibleSteps[nextIndex];
    });
  };

  const goToPrevStep = () => {
    setActiveStep((step) => {
      const prevIndex = visibleSteps.indexOf(step) - 1;
      if (prevIndex < 0) {
        return step;
      }
      return visibleSteps[prevIndex];
    });
  };

  const goToCompleted = () => {
    setActiveStep(visibleSteps[visibleSteps.length - 1]);
  };

  const dispatch = useMemo(() => ({ goToNextStep, goToPrevStep, goToCompleted }), []);

  return (
    <StepperDispatchContext.Provider value={dispatch}>
      <StepperStateContext.Provider value={{ activeStep }}>{children}</StepperStateContext.Provider>
    </StepperDispatchContext.Provider>
  );
};

export const useStepperState = (): StepperState => {
  const context = useContext(StepperStateContext);
  if (!context) {
    throw new Error('useStepperState must be used within a StepperProvider');
  }
  return context;
};

export const useStepperDispatch = (): StepperDispatch => {
  const context = useContext(StepperDispatchContext);
  if (!context) {
    throw new Error('useStepperDispatch must be used within a StepperProvider');
  }
  return context;
};
