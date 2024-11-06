import { GraphQLError } from 'graphql';
import { CombinedError } from 'urql';

import {
  AppError,
  InternalError,
  NotFoundError,
  getDisplayMessage,
  localizedMessages,
  GraphQLErrorExtension,
} from './errors';

test('test AppError instanceof', () => {
  expect(new AppError({ message: 'test', localizedMessage: 'test' })).toBeInstanceOf(AppError);
  expect(new NotFoundError()).toBeInstanceOf(AppError);
  expect(new InternalError()).toBeInstanceOf(AppError);
});

test('test getDisplayMessage', () => {
  expect(getDisplayMessage(null, false)).toEqual({ message: localizedMessages.InternalError });
  expect(getDisplayMessage(null, true)).toEqual({ message: localizedMessages.InternalError });
  expect(getDisplayMessage(new AppError({ message: 'test', localizedMessage: 'テスト' }), false)).toEqual({
    message: 'テスト',
  });
  expect(getDisplayMessage(new AppError({ message: 'test', localizedMessage: 'テスト' }), true)).toEqual({
    message: 'テスト',
    details: ['test'],
  });
  expect(getDisplayMessage(new NotFoundError())).toEqual({ message: localizedMessages.NotFoundError });
  expect(getDisplayMessage(new InternalError())).toEqual({ message: localizedMessages.InternalError });
  expect(getDisplayMessage(new Error('error!'))).toEqual({ message: localizedMessages.InternalError });
  expect(getDisplayMessage(new Error('error!'), true)).toEqual({
    message: localizedMessages.InternalError,
    details: ['error!'],
  });

  const extensions: GraphQLErrorExtension = {
    code: '404',
    localized_message: 'テスト',
  };
  expect(
    getDisplayMessage(
      new CombinedError({
        graphQLErrors: [
          new GraphQLError('invalid query', undefined, undefined, undefined, undefined, undefined, extensions),
        ],
      }),
    ),
  ).toEqual({
    message: 'テスト',
  });

  const unknownExtensions = { hello: 'world' };
  expect(() => {
    getDisplayMessage(
      new CombinedError({
        graphQLErrors: [
          new GraphQLError('invalid query', undefined, undefined, undefined, undefined, undefined, unknownExtensions),
        ],
      }),
    );
  }).toThrowError('Unknown error format');
});
