import { Text, Flex, VStack, Image, HStack, Icon, Center } from '@chakra-ui/react';
import { FC } from 'react';
import HelpOutline from '@mui/icons-material/HelpOutline';

import { PrimaryButton } from '@/components/ui/Button';
import { WrappedLink } from '@/components/ui/WrappedLink';

type Props = {
  onClickNext: () => void;
};

export const Completed: FC<Props> = ({ onClickNext }) => {
  return (
    <Flex pt="59px" direction="column">
      <VStack spacing="0">
        <Image src="/assets/party_popper.gif" alt="登録完了しました🎉" boxSize="280px" />
        <Text className="bold-small">このアカウントはフードデリバリーサービスChompyでもご利用いただけます😊</Text>
      </VStack>
      <Center mt="12px">
        <WrappedLink href="https://www.notion.so/Chompy-ec61268237b64b6e84310be72af882f2" isExternal>
          <HStack color="brand.primary">
            <Icon as={HelpOutline} boxSize="14px" />
            <Text className="bold-extra-small">Chompyってなに？</Text>
          </HStack>
        </WrappedLink>
      </Center>
      <PrimaryButton mt="40px" h="56px" onClick={onClickNext}>
        ホームに戻る
      </PrimaryButton>
    </Flex>
  );
};
