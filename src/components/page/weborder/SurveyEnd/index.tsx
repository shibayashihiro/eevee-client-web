import React from 'react';
import { Stack, Text } from '@chakra-ui/react';

import { NextPageWithLayout } from '@/types';
import { Navbar } from '@/components/domain/Navbar';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';

import { useSurveyEndQuery } from './SurveyEnd.query.generated';

export const SurveyEndPage: NextPageWithLayout = () => {
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const [result] = useSurveyEndQuery();
  const { data, fetching, error } = result;

  useLoadingOverlay(fetching);
  if (error) {
    handleErrorWithAlertDialog(error);
  }
  return (
    data && (
      <>
        <Navbar viewing={data.viewing} viewer={data.viewer} facility={null} />
        <Stack mt="24px" mr="20px" ml="20px">
          <Text mb="20px" className="bold-large">
            アンケートへのご協力ありがとうございました。
          </Text>
          <Text mb="8px" className="text-small">
            アンケートへのご協力ありがとうございました。またのご来店をお待ちしております。
          </Text>
        </Stack>
      </>
    )
  );
};

export default SurveyEndPage;
