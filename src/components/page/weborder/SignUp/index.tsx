import { ParsedUrlQuery } from 'querystring';

import { useCallback, useState } from 'react';
import { Box } from '@chakra-ui/react';

import { NextPageWithLayout } from '@/types';
import { InsideNavbar } from '@/components/ui/InsideNavbar';
import { containerMarginX } from '@/utils/constants';
import { Completed, InputAuthorizationCode, InputPhoneNumber, InputUserInfo } from '@/components/domain/SignUp';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';

const steps = {
  inputPhoneNumber: 0,
  inputAuthorizationCode: 1,
  inputUserInfo: 2,
  completed: 3,
} as const;
type Step = typeof steps[keyof typeof steps];

const initialStep = steps.inputPhoneNumber;
const lastStep = steps.completed;

const titles: Record<Step, string> = {
  [steps.inputPhoneNumber]: '電話番号の確認',
  [steps.inputAuthorizationCode]: '認証コードを入力',
  [steps.inputUserInfo]: 'アカウント作成',
  [steps.completed]: '登録が完了しました',
};

type ExpectedQuery = {
  src?: string;
};

const isExpectedQuery = (query: ParsedUrlQuery): query is ExpectedQuery => {
  return typeof query.src === 'string' || query.src === undefined;
};

const SignUpPage: NextPageWithLayout = () => {
  const router = useTenantRouter();
  const [step, setStep] = useState<Step>(initialStep);
  const [phoneNumber, setPhoneNumber] = useState('');

  const backToSrc = useCallback(() => {
    if (isExpectedQuery(router.query) && router.query.src) {
      router.replace(router.query.src);
      return;
    }
    router.back();
  }, [router]);

  const toNextStep = useCallback(() => {
    if (step === lastStep) {
      backToSrc();
      return;
    }
    setStep((step) => {
      if (step >= lastStep) {
        return step;
      }
      return (step + 1) as Step;
    });
  }, [backToSrc, step]);

  const toPrevStep = useCallback(() => {
    setStep((step) => {
      if (step <= initialStep) {
        return step;
      }
      return (step - 1) as Step;
    });
  }, []);

  const handleSetSignUpRequestPhoneNumber = useCallback((phoneNumber: string) => {
    setPhoneNumber(phoneNumber);
  }, []);

  const handleClickBackIcon = useCallback(() => {
    switch (step) {
      case initialStep:
        router.back();
        break;
      case lastStep:
        backToSrc();
        break;
      default:
        toPrevStep();
        break;
    }
  }, [backToSrc, router, step, toPrevStep]);

  return (
    <>
      <InsideNavbar title={titles[step]} onClickBackIcon={handleClickBackIcon} />
      <Box mx={containerMarginX} pt="24px">
        {step === steps.inputPhoneNumber && (
          <InputPhoneNumber setPhoneNumber={handleSetSignUpRequestPhoneNumber} onClickNext={toNextStep} />
        )}
        {step === steps.inputAuthorizationCode && (
          <InputAuthorizationCode phoneNumber={phoneNumber} onClickNext={toNextStep} />
        )}
        {step === steps.inputUserInfo && <InputUserInfo phoneNumber={phoneNumber} onClickNext={toNextStep} />}
        {step === steps.completed && <Completed onClickNext={toNextStep} />}
      </Box>
    </>
  );
};

export default SignUpPage;
