import { Fragment, useCallback, useState } from 'react';
import { Container } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { NextPageWithLayout } from '@/types';
import { InsideNavbar } from '@/components/ui/InsideNavbar';
import { home } from '@/utils/paths/tenantPages';
import { useRedirectIfAuthenticated } from '@/auth/hooks';

import { SignUpStepInputPhoneNumber } from './SignUpStepInputPhoneNumber';
import { SignUpStepInputUserProfile } from './SignUpStepInputUserProfile';
import { SignUpStepCompleted } from './SignUpStepCompleted';
import { SignUpStepInputAuthorizationCode } from './SignUpStepInputAuthorizationCode';
import { SignUpStepInputCredentials } from './SignUpStepInputCredentials';
import {
  initialStep,
  SignUpStep,
  StepperProvider,
  steps,
  useStepperDispatch,
  useStepperState,
} from './StepperProvider';

export const SignUpPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');

  const backTo = typeof router.query.src === 'string' ? router.query.src : home;

  useRedirectIfAuthenticated({ backTo });

  return (
    <StepperProvider>
      <SignUpStepper
        renderContent={(step) => {
          switch (step) {
            case steps.inputPhoneNumber:
              return <SignUpStepInputPhoneNumber setPhoneNumber={setPhoneNumber} />;
            case steps.inputAuthorizationCode:
              return <SignUpStepInputAuthorizationCode phoneNumber={phoneNumber} />;
            case steps.inputCredentials:
              return <SignUpStepInputCredentials phoneNumber={phoneNumber} />;
            case steps.inputUserInfo:
              return <SignUpStepInputUserProfile />;
            case steps.completed:
              return <SignUpStepCompleted backTo={backTo} />;
            default:
              return <Fragment />;
          }
        }}
      />
    </StepperProvider>
  );
};

type StepperProps = {
  renderContent: (step: SignUpStep) => React.ReactNode;
};

const SignUpStepper = ({ renderContent: render }: StepperProps) => {
  const { activeStep } = useStepperState();
  return (
    <>
      <HeaderNavigation />
      <Container pt="24px">
        <Fragment key={activeStep}>{render(activeStep)}</Fragment>
      </Container>
    </>
  );
};

const titles: Record<SignUpStep, string> = {
  [steps.inputPhoneNumber]: '携帯電話番号の確認',
  [steps.inputAuthorizationCode]: '認証コードを入力',
  [steps.inputCredentials]: 'アカウント作成',
  [steps.inputUserInfo]: 'プロフィールの登録',
  [steps.completed]: '登録が完了しました',
};

const HeaderNavigation = () => {
  const router = useRouter();
  const { activeStep } = useStepperState();
  const { goToPrevStep } = useStepperDispatch();

  const showBack = activeStep == steps.inputPhoneNumber || activeStep == steps.inputAuthorizationCode;

  const handleClickBackIcon = useCallback(() => {
    if (activeStep === steps.completed) {
      return null;
    }
    if (activeStep === initialStep) {
      router.back();
      return;
    }
    if (!showBack) {
      return;
    }
    goToPrevStep();
  }, [activeStep, goToPrevStep, router, showBack]);

  if (activeStep === steps.completed) {
    return null;
  }

  return <InsideNavbar title={titles[activeStep]} hideBackIcon={!showBack} onClickBackIcon={handleClickBackIcon} />;
};
