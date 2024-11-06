import { Text, Flex, VStack, HStack, Checkbox } from '@chakra-ui/react';
import { FC, useCallback, useMemo, useReducer, useState } from 'react';

import { InputPassword, InputWithLabel } from '@/components/ui/Input';
import { PrimaryButton } from '@/components/ui/Button';
import { WrappedLink } from '@/components/ui/WrappedLink';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { validateEmail, validateKana } from '@/utils/validator';
import { privacyPage } from '@/utils/paths/tenantPages';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { useAuthUser } from '@/auth/provider/AuthUserProvider';
import { useAuth } from '@/auth/provider/AuthProvider';

import { TenantPageLink } from '../TenantPageLink';

import { useSignUpMutation } from './SignUp.mutation.generated';

type FormState = {
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  email: string;
  password: string;
};

const initialState: FormState = {
  lastName: '',
  firstName: '',
  lastNameKana: '',
  firstNameKana: '',
  email: '',
  password: '',
} as const;

type ActionTypes = 'setLastName' | 'setFirstName' | 'setLastNameKana' | 'setFirstNameKana' | 'setEmail' | 'setPassword';
type Action = {
  type: ActionTypes;
  payload: string;
};

const reducer = (state: FormState, action: Action): FormState => {
  switch (action.type) {
    case 'setLastName':
      return { ...state, lastName: action.payload };
    case 'setFirstName':
      return { ...state, firstName: action.payload };
    case 'setLastNameKana':
      return { ...state, lastNameKana: action.payload };
    case 'setFirstNameKana':
      return { ...state, firstNameKana: action.payload };
    case 'setEmail':
      return { ...state, email: action.payload };
    case 'setPassword':
      return { ...state, password: action.payload };
    default:
      return state;
  }
};

type Props = {
  phoneNumber: string;
  onClickNext: () => void;
};

export const InputUserInfo: FC<Props> = ({ phoneNumber, onClickNext }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [agree, setAgree] = useState(false);

  const { signIn } = useAuth();
  const { id: userId } = useAuthUser();

  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();
  const [result, signUp] = useSignUpMutation();
  useLoadingOverlay(result.fetching);

  const isValid = useMemo(() => {
    if (
      state.lastName.length == 0 ||
      state.firstName.length == 0 ||
      state.lastNameKana.length == 0 ||
      state.firstNameKana.length == 0 ||
      state.email.length == 0 ||
      state.password.length == 0
    ) {
      return false;
    }
    if (!validateKana(state.lastNameKana) || !validateKana(state.firstNameKana)) {
      return false;
    }
    return validateEmail(state.email);
  }, [state.lastName, state.firstName, state.lastNameKana, state.firstNameKana, state.email, state.password]);

  const agreementLinks: { text: string; url: string; isExternal: boolean }[] = useMemo(
    () => [
      {
        text: 'サービス利用規約',
        url: 'https://chompy.notion.site/1a5b395ee0074dbc894fb23f81da03fd',
        isExternal: true,
      },
      { text: 'プライバシーポリシー', url: privacyPage, isExternal: false },
      { text: 'Chompyユーザー利用規約', url: 'https://chompy.jp/tos/', isExternal: true },
      { text: '商品提供取引Chompyユーザーガイドライン', url: 'https://chompy.jp/tos/goods.html', isExternal: true },
      { text: 'Chompyクルー利用規約', url: 'https://chompy.jp/tos/crew/', isExternal: true },
      {
        text: 'および商品提供取引Chompyクルーガイドライン',
        url: 'https://chompy.jp/tos/crew/goods.html',
        isExternal: true,
      },
    ],
    [],
  );

  const handleChangeLastName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'setLastName', payload: e.target.value.trim() });
  }, []);

  const handleChangeFirstName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'setFirstName', payload: e.target.value.trim() });
  }, []);

  const handleChangeLastNameKana = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'setLastNameKana', payload: e.target.value.trim() });
  }, []);

  const handleChangeFirstNameKana = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'setFirstNameKana', payload: e.target.value.trim() });
  }, []);

  const handleChangeEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'setEmail', payload: e.target.value.trim() });
  }, []);

  const handleChangePassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'setPassword', payload: e.target.value.trim() });
  }, []);

  const handleChangeAgree = (e: React.ChangeEvent<HTMLInputElement>) => setAgree(e.target.checked);

  const handleClickNext = useCallback(async () => {
    if (!isValid) {
      return;
    }
    const { error } = await signUp({
      input: {
        anonymousUserID: userId,
        phoneNumber,
        lastName: state.lastName,
        firstName: state.firstName,
        lastNameKana: state.lastNameKana,
        firstNameKana: state.firstNameKana,
        email: state.email,
        password: state.password,
      },
    });
    if (error) {
      handleErrorWithAlertDialog(error);
      return;
    }
    // 登録後、サインインする
    await signIn(state.email, state.password);
    onClickNext();
  }, [
    isValid,
    signUp,
    userId,
    phoneNumber,
    state.lastName,
    state.firstName,
    state.lastNameKana,
    state.firstNameKana,
    state.email,
    state.password,
    signIn,
    onClickNext,
    handleErrorWithAlertDialog,
  ]);

  const { lastName, firstName, lastNameKana, firstNameKana, email, password } = state;

  return (
    <Flex direction="column">
      <Text className="bold-small" w="full">
        お名前とメールアドレスを教えてください
      </Text>
      <VStack mt="32px" spacing="24px">
        <HStack w="full" spacing="16px">
          <InputWithLabel
            w="full"
            id="lastName"
            label="姓"
            placeholder="山田"
            value={lastName}
            onChange={handleChangeLastName}
          />
          <InputWithLabel
            w="full"
            id="firstName"
            label="名"
            placeholder="太郎"
            value={firstName}
            onChange={handleChangeFirstName}
          />
        </HStack>
        <HStack w="full" spacing="16px">
          <InputWithLabel
            w="full"
            id="lastNameKana"
            label="姓カナ"
            placeholder="ヤマダ"
            value={lastNameKana}
            onChange={handleChangeLastNameKana}
          />
          <InputWithLabel
            w="full"
            id="firstNameKana"
            label="名カナ"
            placeholder="タロウ"
            value={firstNameKana}
            onChange={handleChangeFirstNameKana}
          />
        </HStack>
        <InputWithLabel
          w="full"
          id="email"
          label="メールアドレス"
          placeholder="food@chompy.com"
          value={email}
          onChange={handleChangeEmail}
          type="email"
        />
        <InputPassword w="full" id="password" label="パスワード" value={password} onChange={handleChangePassword} />
      </VStack>

      <VStack mt="24px" spacing="24px" w="full">
        <HStack alignItems="start">
          <Checkbox colorScheme="brand" size="lg" onChange={handleChangeAgree} />
          <Text>
            {agreementLinks.map((link, index) => (
              <>
                {link.isExternal ? (
                  <WrappedLink key={index} color="brand.primaryText" href={link.url} isExternal>
                    {link.text}
                  </WrappedLink>
                ) : (
                  <TenantPageLink key={index} color="brand.primaryText" href={link.url} target="_blank">
                    {link.text}
                  </TenantPageLink>
                )}
                {index !== agreementLinks.length - 1 && '、'}
              </>
            ))}
            に同意します。
          </Text>
        </HStack>
        <PrimaryButton h="56px" disabled={!agree || !isValid} onClick={handleClickNext}>
          次へ
        </PrimaryButton>
      </VStack>
    </Flex>
  );
};
