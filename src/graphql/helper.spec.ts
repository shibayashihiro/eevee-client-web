import * as types from '@/graphql/generated/types';

import { generateMutationId, isObjectType } from './helper';

test('test isObjectType', () => {
  expect(isObjectType<types.Cart>({ __typename: 'Cart' }, 'Cart')).toBe(true);
  expect(isObjectType<types.Cart>({ __typename: 'User' }, 'Cart')).toBe(false);
  expect(isObjectType<types.User>({ __typename: 'Cart' }, 'User')).toBe(false);
  expect(isObjectType<types.OwnerComment>({ __typename: 'OwnerComment' }, 'OwnerComment')).toBe(true);
  expect(isObjectType<types.OptionItem>({ __typename: 'OptionItem' }, 'OptionItem')).toBe(true);
  /* Genericsなしでも使えてしまうので注意(その場合第二引数の補完が効かないだけ) */
  expect(isObjectType({ __typename: 'OptionItem' }, 'OptionItem')).toBe(true);
  expect(isObjectType({ __typename: 'OptionItem' }, 'OptionItema')).toBe(false);
});

test('test generateMutationId', () => {
  expect(generateMutationId().length).toBe(16);
});
