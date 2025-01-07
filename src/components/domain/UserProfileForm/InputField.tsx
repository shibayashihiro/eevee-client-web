import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, Select, Text } from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';
import { useState } from 'react';

import { UserProfileInputFieldType } from '@/graphql/generated/types';
import { ChevronDownIcon } from '@/components/ui/Icons/ChevronDownIcon';

import { FormField, FormValues, nameByFieldType } from './schema';
import { UserProfileFormInputFieldFragment } from './UserProfileForm.fragment.generated';

type Props = {
  field: UserProfileFormInputFieldFragment;
  isDisabled?: boolean;
};

export const UserProfileFormInput = ({ field, isDisabled }: Props) => {
  const {
    formState: { errors },
  } = useUserProfileFormContext();
  const name = nameByFieldType[field.type];
  const error = errors[name];
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel fontSize="extra-small" fontWeight="bold" lineHeight="extra-small" color="mono.secondary" mb={0}>
        {field.title}
        <Text
          as="span"
          display="block"
          textStyle={field.required ? 'bold-micro' : 'text-micro'}
          color={field.required ? 'brand.primary' : 'mono.secondary'}
          mt="4px"
        >
          {field.required ? '必須' : '任意'}
        </Text>
      </FormLabel>
      {!error && !isDisabled && field.helpText && (
        <FormHelperText textStyle="text-extra-small" color="mono.secondary" mt="4px" whiteSpace="pre-line">
          {field.helpText}
        </FormHelperText>
      )}
      {error?.message && (
        <FormErrorMessage textStyle="bold-extra-small" color="mono.error">
          {error.message}
        </FormErrorMessage>
      )}
      <InputByType field={field} isDisabled={isDisabled} />
    </FormControl>
  );
};

const InputByType = ({ field, isDisabled }: { field: UserProfileFormInputFieldFragment; isDisabled?: boolean }) => {
  const name = nameByFieldType[field.type];
  switch (field.type) {
    case UserProfileInputFieldType.DisplayName:
    case UserProfileInputFieldType.LastNameKana:
      return <InputAsText name={name} placeholder={field.placeholder ?? undefined} isDisabled={isDisabled} />;
    case UserProfileInputFieldType.BirthDate:
      return <InputAsDate name={name} placeholder={field.placeholder ?? undefined} isDisabled={isDisabled} />;
    case UserProfileInputFieldType.Gender:
    case UserProfileInputFieldType.Occupation:
    case UserProfileInputFieldType.Prefecture:
      return (
        <InputAsSelect
          name={name}
          options={field.values ?? []}
          placeholder={field.placeholder ?? undefined}
          isDisabled={isDisabled}
        />
      );
  }
};

const InputAsText = ({
  name,
  placeholder,
  isDisabled,
}: {
  name: FormField;
  placeholder?: string;
  isDisabled?: boolean;
}) => {
  const { register } = useUserProfileFormContext();
  return <Input mt="8px" type="text" placeholder={placeholder} isDisabled={isDisabled} {...register(name)} />;
};

const InputAsSelect = ({
  name,
  options,
  placeholder,
  isDisabled,
}: {
  name: FormField;
  options: string[];
  placeholder?: string;
  isDisabled?: boolean;
}) => {
  const { control } = useUserProfileFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          mt="8px"
          icon={<ChevronDownIcon boxSize="24px" color="mono.secondary" />}
          placeholder={placeholder}
          color={field.value ? 'mono.primary' : 'mono.secondary'}
          isDisabled={isDisabled}
          {...field}
        >
          {options.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </Select>
      )}
    />
  );
};

// 日付の変換等をおこなっており複雑なので、テストを書けるようにこれだけexportしています
export const InputAsDate = ({
  name,
  placeholder,
  isDisabled,
}: {
  name: FormField;
  placeholder?: string;
  isDisabled?: boolean;
}) => {
  const [isFocus, setIsFocus] = useState(false);
  const { control } = useUserProfileFormContext();

  const transformOutput = (value: string) => {
    if (!value) {
      return '';
    }
    return value.replace(/\D/g, '');
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformInput = (value: any) => {
    if (!value) {
      return '';
    }
    if (isFocus) {
      return value;
    }
    const v = value.replace(/\D/g, '');
    if (v.length !== 8) {
      return v;
    }
    return `${v.slice(0, 4)}年${v.slice(4, 6)}月${v.slice(6, 8)}日`;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <>
          <Input
            mt="8px"
            type="text"
            inputMode="numeric"
            maxLength={8}
            placeholder={placeholder}
            isDisabled={isDisabled}
            onChange={(e) => field.onChange(transformOutput(e.target.value))}
            value={transformInput(field.value)}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
          />
        </>
      )}
    />
  );
};

const useUserProfileFormContext = () => useFormContext<FormValues>();
