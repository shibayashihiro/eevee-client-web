import React, { FC } from 'react';
import { VStack, Text, Icon, HStack, Box } from '@chakra-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MapIcon from '@mui/icons-material/Map';
import { useState } from 'react';

import { isFacility } from '@/graphql/helper';
import { localizedMessages } from '@/utils/errors';
import { ModalDialog } from '@/components/ui/ModalDialog';
import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { Facility } from '@/graphql/generated/types';
import { useGetFacilityLocationQuery } from '@/components/domain/FacilityLocationDialog/FacilityLocationDialog.query.generated';
import { SecondaryButton } from '@/components/ui/Button';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const FacilityLocationDialog: FC<Props> = ({ isOpen, onClose }) => {
  const facilityId = useFacilityId();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const fullAddress = (facility: Facility): string => {
    const { address1, address2 } = facility;
    return `${address1}${address2}`;
  };

  const [result] = useGetFacilityLocationQuery({
    variables: {
      facilityID: facilityId,
    },
  });
  const { data, fetching, error } = result;
  useLoadingOverlay(fetching);
  if (error) {
    handleErrorWithAlertDialog(error);
  }

  const { facility } = data ?? {};
  if (!fetching && !data) {
    handleErrorWithAlertDialog(new Error(localizedMessages.NotFoundError));
  }

  function onClickHref(facilityName: string) {
    window.open(`https://www.google.com/maps/search/?api=1&query=${facilityName}`);
  }

  const [isShowCopyComletedDialog, setIsShowCopyComletedDialog] = useState(false);
  const onClickShow = () => {
    setIsShowCopyComletedDialog(true);
  };
  const onClickClose = () => {
    setIsShowCopyComletedDialog(false);
  };

  return (
    <>
      <ModalDialog
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={true}
        secondaryAction={{
          text: '閉じる',
          onClick: onClose,
        }}
      >
        {facility && isFacility(facility) && (
          <VStack align="start" spacing={0}>
            <Text className="bold-large">{facility.name}</Text>
            <Box h="4px" />
            <Text className="bold-small" mt="12px" mb="24px">
              {fullAddress(facility)}
            </Text>
            <CopyToClipboard text={fullAddress(facility)}>
              <SecondaryButton onClick={onClickShow} h="64px" rounded="20px">
                <HStack justifyContent={'space-between'} width={'full'}>
                  <Text className="bold-small">住所をコピーする</Text>
                  <Icon as={ContentCopyIcon} boxSize="24px" />
                </HStack>
              </SecondaryButton>
            </CopyToClipboard>
            <Box h="8px" />
            <SecondaryButton h="64px" rounded="20px" onClick={() => onClickHref(facility.name)}>
              <HStack justifyContent={'space-between'} width={'full'}>
                <Text className="text-small">地図アプリで開く</Text>
                <Icon as={MapIcon} boxSize="24px" />
              </HStack>
            </SecondaryButton>
          </VStack>
        )}
      </ModalDialog>
      {isShowCopyComletedDialog && (
        <div
          onClick={onClickClose}
          style={{
            backgroundColor: 'rgba(51,51,51,0.77)',
            width: '100%',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'Center',
            position: 'absolute',
            left: '0',
            right: '0',
            top: '0',
            bottom: '0',
            zIndex: '1401',
          }}
        >
          <div
            style={{
              backgroundColor: '#DFDFDF',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'Center',
              width: '270px',
              height: '95px',
              borderRadius: 14,
              position: 'absolute',
            }}
          >
            <Text className="bold-large">お店の住所</Text>
            <Text className="text-extra-small" mt="6px">
              コピーが完了しました
            </Text>
          </div>
        </div>
      )}
    </>
  );
};
