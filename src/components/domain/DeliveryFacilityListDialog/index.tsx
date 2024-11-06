import { FC, useCallback } from 'react';
import {
  VStack,
  StackDivider,
  Spacer,
  LinkBox,
  LinkOverlay,
  HStack,
  Image,
  Text,
  Spinner,
  Center,
} from '@chakra-ui/react';

import { ModalDialog } from '@/components/ui/ModalDialog';
import { LatLng } from '@/graphql/generated/types';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { meterToKmText } from '@/utils/formatUtils';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { deliveryHome } from '@/utils/paths/facilityPages';

import { AvailableOrderTypeBadge } from '../AvailableOrderTypeBadge';

import { useGetDeliveryAvailableFacilitiesQuery } from './DeliveryFacilityListDialog.query.generated';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  latLng: LatLng;
};

export const DeliveryFacilityListDialog: FC<Props> = ({ isOpen, onClose, latLng }) => {
  const router = useTenantRouter();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const [result] = useGetDeliveryAvailableFacilitiesQuery({
    variables: {
      location: latLng,
    },
    pause: !isOpen,
  });

  const { data, fetching, error } = result;

  const geneHandleClickFacilityLink = useCallback(
    (facilityId: string) => {
      return () => {
        onClose();
        router.push(deliveryHome(facilityId));
      };
    },
    [onClose, router],
  );

  if (error) {
    handleErrorWithAlertDialog(error);
  }

  const facilities = data?.deliveryAvailableFacilities ?? [];

  const closeAction = {
    text: '閉じる',
    onClick: onClose,
  };

  if (!fetching && facilities.length === 0) {
    return (
      <ModalDialog isOpen={isOpen} onClose={onClose} title="配達できるお店がありません" secondaryAction={closeAction}>
        現在設定されているお届け先に配達できるお店がありません。別のお届け先をお試しください。
      </ModalDialog>
    );
  }

  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title="配達できるお店" secondaryAction={closeAction}>
      {fetching ? (
        <Center>
          <Spinner className="mono-secondary" />
        </Center>
      ) : (
        <VStack w="full" spacing="14px" divider={<StackDivider color="mono.divider" />}>
          {/* 最初と最後にDividerを表示したいため空要素を置く */}
          <Spacer />
          {facilities.map((f) => (
            <LinkBox key={f.id} w="full" alignItems="start">
              <LinkOverlay href="#" onClick={geneHandleClickFacilityLink(f.id)}>
                <HStack w="full" spacing="12px" alignItems="start">
                  <Image alt={`${f.shortName}店舗画像`} src={f.image} rounded="4px" boxSize="88px" objectFit="cover" />
                  <VStack alignItems="start" spacing="8px">
                    <VStack alignItems="start">
                      <Text className="bold-medium">{f.shortName}</Text>
                      <Text className="bold-extra-small">
                        お届け先から{meterToKmText(f.metaByLocation?.distance ?? 0)}
                        <br />
                        最短のお届け時間の目安: {f.metaByLocation?.deliveryEstimatedArrivalTimeLabel}
                      </Text>
                    </VStack>
                    <VStack spacing="6px" alignItems="start">
                      {f.availableOrderTypes.map((ot, i) => (
                        <AvailableOrderTypeBadge key={i} availableOrderType={ot} />
                      ))}
                    </VStack>
                  </VStack>
                </HStack>
              </LinkOverlay>
            </LinkBox>
          ))}
          <Spacer />
        </VStack>
      )}
    </ModalDialog>
  );
};
