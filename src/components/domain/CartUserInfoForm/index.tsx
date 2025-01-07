import { VStack, Text, FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';

import { errorMessage, useCartUserInfoFormDispatch, useCartUserInfoFormState } from './provider';
import { UserInfoInputItem } from './formItem';

export const CartUserInfoInput = () => {
  const { formItems } = useCartUserInfoFormState();
  const inputContents = formItems.map((item) => item.nameInNotice).join('と');
  return (
    <VStack align="stretch" border="1px" p="20px" borderRadius="12px" borderColor="mono.bg" spacing="20px">
      <Text className="bold-small">
        ご注文に関してお店からご連絡することがございます。お手数ですが{inputContents}をご登録ください。
      </Text>
      {formItems.map((item) => (
        <UserInfoInput key={item.name} item={item} />
      ))}
    </VStack>
  );
};

const UserInfoInput = ({ item }: { item: UserInfoInputItem }) => {
  const formState = useCartUserInfoFormState();
  const dispatch = useCartUserInfoFormDispatch();

  const error = formState.errors?.[item.name];

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: item.actionType, payload: e.target.value });
  };

  const handleOnBlur = () => {
    const err = errorMessage(formState, item.name);
    dispatch({ type: 'SET_ERROR', payload: { name: item.name, message: err } });
  };

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel display="flex" flexDirection="column">
        <Text as="span" className="bold-small">
          {item.label}
        </Text>
        <Text as="span" className="bold-micro" color="brand.primaryText" mt="2px">
          必須
        </Text>
      </FormLabel>
      <Input
        type={item.type}
        name={item.name}
        autoComplete={item.autocomplete}
        value={formState[item.name]}
        placeholder={item.placeholder}
        isRequired
        onChange={handleOnChange}
        onBlur={handleOnBlur}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};
