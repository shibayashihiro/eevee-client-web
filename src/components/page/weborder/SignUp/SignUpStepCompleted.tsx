import { Text, Flex, VStack, Divider } from '@chakra-ui/react';

import { PrimaryButton } from '@/components/ui/Button';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import variables from '@/styles/variables.module.scss';
import { CompletedIcon, SignUpCompletedCouponIcon } from '@/components/ui/Icons/CompletedIcon';

import { GetSignUpCompletedPageQuery, useGetSignUpCompletedPageQuery } from './SignUpStepCompleted.query.generated';

type Props = {
  backTo: string;
};

export const SignUpStepCompleted = ({ backTo }: Props) => {
  const [{ data, error, fetching }] = useGetSignUpCompletedPageQuery();

  if (fetching) {
    return <LoadingSpinner />;
  }
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error('not found');
  }
  return <SignUpStepCompletedLayout backTo={backTo} data={data} />;
};

const SignUpStepCompletedLayout = ({
  backTo,
  data,
}: Props & {
  data: GetSignUpCompletedPageQuery;
}) => {
  const router = useTenantRouter();

  const { idProviderName, accountRegistrationIncentives } = data.tenant;
  const hasAccountRegistrationCoupon = accountRegistrationIncentives.length > 0;
  return (
    <Flex
      mx="auto"
      pt={hasAccountRegistrationCoupon ? '59px' : '230px'}
      direction="column"
      justifyContent="flex-start"
      maxW={variables.containerMaxWidth}
    >
      <VStack spacing="24px">
        <CompletedIcon boxSize="96px" color="brand.primary" />
        <Text className="bold-normal" textAlign="center">
          {idProviderName}の新規登録が完了しました
        </Text>
      </VStack>
      {hasAccountRegistrationCoupon && (
        <>
          <Divider mt="40px" />
          <VStack spacing="24px" mt="40px" textAlign="center">
            <SignUpCompletedCouponIcon boxSize="96px" color="brand.primary" />
            <Text className="bold-normal">
              新規登録でクーポンを獲得しました。
              <br />
              獲得したクーポンは「マイページ」＞「所有クーポン」よりご確認できます
            </Text>
          </VStack>
        </>
      )}
      <PrimaryButton
        mt="40px"
        h="56px"
        onClick={() => {
          router.replace(encodeURI(backTo));
        }}
      >
        次に進む
      </PrimaryButton>
    </Flex>
  );
};
