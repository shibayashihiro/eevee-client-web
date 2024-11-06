import React from 'react';
import { Stack, Text } from '@chakra-ui/react';

import { surveyPage } from '@/utils/paths/facilityPages';
import { PrimaryButton } from '@/components/ui/Button';
import { NextPageWithLayout } from '@/types';
import { useFacilityId, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { Navbar } from '@/components/domain/Navbar';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';

import { useSurveyStartQuery } from './SurveyStart.query.generated';

export const SurveyStartPage: NextPageWithLayout = () => {
  const router = useTenantRouter();
  const facilityId = useFacilityId();

  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();
  const { surveyId } = router.query;

  const [result] = useSurveyStartQuery();
  const { data, fetching, error } = result;

  useLoadingOverlay(fetching);
  if (error) {
    handleErrorWithAlertDialog(error);
  }

  const handleOnClick = () => {
    // 次のページへの遷移処理をここに記述
    if (typeof facilityId === 'string' && typeof surveyId === 'string') {
      router.push(surveyPage(facilityId, surveyId)); // 適切なURLに変更してください
    } else {
      throw error;
    }
  };
  return (
    data && (
      <>
        <Navbar viewing={data.viewing} viewer={data.viewer} facility={null} />
        <Stack mt="24px" mr="20px" ml="20px">
          <Text mb="20px" className="bold-large">
            ご注文ありがとうございました。2分ほどで完了するアンケートのご協力をお願いいたします。
          </Text>
          <Text mb="8px" className="text-small">
            このたびはご注文ありがとうございました。 よろしければ感想をお聞かせください。
          </Text>
          <Text mb="32px" className="text-extra-small mono-secondary">
            ※いただいた情報はサービス改善のために利用します。
          </Text>
          <PrimaryButton h="56px" onClick={handleOnClick}>
            次へ
          </PrimaryButton>
        </Stack>
      </>
    )
  );
};

export default SurveyStartPage;
