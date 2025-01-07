import {
  pipe,
  object,
  optional,
  string,
  minLength,
  date,
  maxValue,
  transform,
  maxLength,
  length,
  check,
  safeParse,
  nonEmpty,
} from 'valibot';

import { UserProfileInputFieldType } from '@/graphql/generated/types';

import { UserProfileFormInputFieldFragment } from './UserProfileForm.fragment.generated';

export type FormValues = {
  displayName: string;
  lastNameKana: string;
  birthDate: string;
  gender: string;
  occupation: string;
  prefecture: string;
};

export type FormField = keyof FormValues;

// 初期値として渡される時は、DateObject型で受け取るようにする
export type InitialValuesType = Partial<Omit<FormValues, 'birthDate'> & { birthDate: DateObject }>;

/**
 * 日付検証用のスキーマ
 * (入力があった場合のみ検証をおこないたいため難しくなってしまった)
 */
const dateStringSchema = pipe(
  string(),
  length(8, '8桁の数字で入力してください。(例: 19920201 ※1992年2月1日生まれの場合)'),
  transform((input) => new Date(`${input.slice(0, 4)}-${input.slice(4, 6)}-${input.slice(6, 8)}`)),
  date('無効な日付です'),
  maxValue(new Date(), '未来の日付は入力できません'),
);
const getBirthDateSchema = (required: boolean, requiredMessage: string) => {
  const stringSchema = required ? pipe(string(requiredMessage), nonEmpty(requiredMessage)) : optional(string());
  return pipe(
    stringSchema,
    check((input) => {
      if (!input) {
        // 未入力の場合はバリデーションをSKIP（※事前に別途必須チェックを行っている前提
        return true;
      }
      const result = safeParse(dateStringSchema, input);
      return result.success;
    }, '8桁の数字で入力してください。(例: 19920201 ※1992年2月1日生まれの場合)'),
  );
};

const katakanaSchema = pipe(
  string(),
  check((input) => {
    if (!input) return true;
    return /^[ァ-ヶー]+$/.test(input);
  }, '全角カタカナで入力してください'),
);

export const nameByFieldType: Record<UserProfileInputFieldType, FormField> = {
  [UserProfileInputFieldType.DisplayName]: 'displayName',
  [UserProfileInputFieldType.LastNameKana]: 'lastNameKana',
  [UserProfileInputFieldType.BirthDate]: 'birthDate',
  [UserProfileInputFieldType.Gender]: 'gender',
  [UserProfileInputFieldType.Occupation]: 'occupation',
  [UserProfileInputFieldType.Prefecture]: 'prefecture',
} as const;

/**
 * getSchema は、valibot の schema(validation用) を動的に生成して返す
 */
export const getSchema = (fields: UserProfileFormInputFieldFragment[]) => {
  const schema = fields.reduce((acc, field) => {
    const name = nameByFieldType[field.type];
    const requiredErrorMessage = `${field.title}を入力してください`;
    switch (field.type) {
      // typeごとにvalidationのschemaを返す
      case UserProfileInputFieldType.DisplayName:
        return {
          ...acc,
          [name]: field.required
            ? pipe(
                string(requiredErrorMessage),
                minLength(1, requiredErrorMessage),
                maxLength(200, '200文字以内で入力してください'),
              )
            : optional(pipe(string(), maxLength(200, '200文字以内で入力してください'))),
        };
      case UserProfileInputFieldType.LastNameKana:
        return {
          ...acc,
          [name]: field.required
            ? pipe(
                string(requiredErrorMessage),
                minLength(1, requiredErrorMessage),
                maxLength(200, '200文字以内で入力してください'),
                katakanaSchema,
              )
            : optional(pipe(string(), maxLength(200, '200文字以内で入力してください'), katakanaSchema)),
        };
      case UserProfileInputFieldType.Gender:
      case UserProfileInputFieldType.Occupation:
      case UserProfileInputFieldType.Prefecture:
        return {
          ...acc,
          [name]: field.required
            ? pipe(string(requiredErrorMessage), minLength(1, requiredErrorMessage))
            : optional(string()),
        };
      case UserProfileInputFieldType.BirthDate:
        return {
          ...acc,
          birthDate: getBirthDateSchema(field.required, requiredErrorMessage),
        };
    }
  }, {});
  return object(schema);
};

type DateObject = {
  year: number;
  month: number;
  day: number;
};

export const dateToInputString = (birthDate: DateObject) => {
  const year = birthDate.year.toString().padStart(4, '0');
  const month = birthDate.month.toString().padStart(2, '0');
  const day = birthDate.day.toString().padStart(2, '0');
  return `${year}${month}${day}`;
};

export const inputDateStringToDateObj = (input: string): DateObject => {
  if (input.length !== 8) {
    throw new Error('Invalid date string');
  }
  const d = new Date(`${input.slice(0, 4)}-${input.slice(4, 6)}-${input.slice(6, 8)}`);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date string');
  }
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
  };
};
