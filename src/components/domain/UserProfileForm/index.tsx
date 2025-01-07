import { Center, Link, VStack } from '@chakra-ui/react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useMemo } from 'react';

import { PrimaryButton } from '@/components/ui/Button';
import { useGlobalLoadingSpinnerDispatch } from '@/providers/GlobalLoadingSpinnerProvider';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { UserProfileInputFieldType } from '@/graphql/generated/types';

import { UserProfileFormInput } from './InputField';
import {
  TenantUserProfileFormFieldsFragment,
  UserProfileFormInputFieldFragment,
} from './UserProfileForm.fragment.generated';
import { dateToInputString, FormValues, getSchema, InitialValuesType, inputDateStringToDateObj } from './schema';
import { useSubmitUserProfileFormMutation } from './UserProfileForm.mutation.generated';

type Props = {
  tenant: TenantUserProfileFormFieldsFragment;
  /**
   * フォームの入力内容初期値
   */
  initialValues?: InitialValuesType;
  /**
   * submit後に実行する処理
   */
  onSubmitted: () => void;
  /**
   * 「あとで設定する」をクリックした時に実行する処理
   */
  onClickSetupLater: () => void;
};

export const UserProfileForm = ({
  tenant: { userProfileInputFields },
  initialValues,
  onSubmitted,
  onClickSetupLater,
}: Props) => {
  const [_, submitUserProfile] = useSubmitUserProfileFormMutation();
  const setLoading = useGlobalLoadingSpinnerDispatch();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const methods = useUserProfileForm(userProfileInputFields, initialValues);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    try {
      const { error } = await submitUserProfile({
        input: {
          ...data,
          birthDate: data.birthDate ? inputDateStringToDateObj(data.birthDate) : null,
        },
      });
      if (error) {
        handleErrorWithAlertDialog(error);
        return;
      }
      onSubmitted();
    } finally {
      setLoading(false);
    }
  };

  // 非活性にする条件をTypeごとに設定
  const disables: Partial<Record<UserProfileInputFieldType, boolean>> = useMemo(() => {
    return {
      // 生年月日は1度しか登録できないため、初期値がある場合は入力不可にする
      [UserProfileInputFieldType.BirthDate]: !!initialValues?.birthDate,
    };
  }, [initialValues?.birthDate]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <VStack spacing="24px" align="start" w="full">
          {userProfileInputFields.map((field, index) => {
            return <UserProfileFormInput key={index} field={field} isDisabled={disables[field.type]} />;
          })}
        </VStack>
        <VStack align="stretch" spacing="16px" mt="24px">
          <PrimaryButton type="submit">設定する</PrimaryButton>
          <Center>
            <SetupLaterLink onClick={onClickSetupLater} />
          </Center>
        </VStack>
      </form>
    </FormProvider>
  );
};

const SetupLaterLink = ({ onClick }: { onClick: () => void }) => {
  return (
    <Link textStyle="bold-extra-small" onClick={onClick}>
      あとで設定する
    </Link>
  );
};

const useUserProfileForm = (fields: UserProfileFormInputFieldFragment[], initialValues?: InitialValuesType) => {
  const schema = getSchema(fields);
  return useForm<FormValues>({
    resolver: valibotResolver(schema),
    defaultValues: {
      ...initialValues,
      birthDate: initialValues?.birthDate ? dateToInputString(initialValues.birthDate) : undefined,
    },
  });
};
