import { ParsedUrlQuery } from 'querystring';

import { useCallback, useState } from 'react';
import { Box } from '@chakra-ui/react';

import { InsideNavbar } from '@/components/ui/InsideNavbar';
import { NextPageWithLayout } from '@/types';
import { containerMarginX } from '@/utils/constants';
import { SelectPlacePrediction, InputAddresses } from '@/components/domain/DeliveryAddressAdd';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';

import { useGetPlaceDetailsForInputAddressQuery } from './DeliveryAddressAdd.query.generated';

const steps = {
  selectPlacePrediction: 0,
  inputAddresses: 1,
} as const;
type Step = (typeof steps)[keyof typeof steps];

const initialStep = steps.selectPlacePrediction;
const lastStep = steps.inputAddresses;

const titles: Record<Step, string> = {
  [steps.selectPlacePrediction]: '住所・ビル名・地名で登録',
  [steps.inputAddresses]: '配達先の設定',
};

type ExpectedQuery = {
  src?: string;
};

const isExpectedQuery = (query: ParsedUrlQuery): query is ExpectedQuery => {
  return typeof query.src === 'string' || query.src === undefined;
};

const DeliveryAddressAddPage: NextPageWithLayout = () => {
  const router = useTenantRouter();
  const [step, setStep] = useState<Step>(initialStep);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('');

  const [result] = useGetPlaceDetailsForInputAddressQuery({
    variables: { placeId: selectedPlaceId },
    pause: selectedPlaceId === '',
  });

  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const { data, error, fetching } = result;
  useLoadingOverlay(fetching);
  if (error) {
    handleErrorWithAlertDialog(error);
  }

  const toNextStep = useCallback(() => {
    if (step >= lastStep) {
      if (isExpectedQuery(router.query) && router.query.src) {
        router.push(router.query.src);
      } else {
        router.back();
      }
      return;
    }
    setStep((step) => {
      return (step + 1) as Step;
    });
  }, [router, step]);

  const toPrevStep = useCallback(() => {
    setStep((step) => {
      if (step <= initialStep) {
        return step;
      }
      return (step - 1) as Step;
    });
  }, []);

  const handleClickBackIcon = useCallback(() => {
    if (step === initialStep) {
      router.back();
      return;
    }
    toPrevStep();
  }, [router, step, toPrevStep]);

  const handleClickPlacePrediction = useCallback(
    (placeId: string) => {
      setSelectedPlaceId(placeId);
      toNextStep();
    },
    [toNextStep],
  );

  return (
    <>
      <InsideNavbar title={titles[step]} onClickBackIcon={handleClickBackIcon} />
      <Box mx={containerMarginX} pt="24px">
        {step === steps.selectPlacePrediction && (
          <SelectPlacePrediction onClickPlacePrediction={handleClickPlacePrediction} />
        )}
        {step === steps.inputAddresses && !fetching && data?.placeAddress && (
          <InputAddresses fragment={data.placeAddress} onSubmit={toNextStep} />
        )}
      </Box>
    </>
  );
};

export default DeliveryAddressAddPage;
