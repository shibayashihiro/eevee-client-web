import { GraphQLError } from 'graphql';
import { CombinedError } from 'urql';

type AppErrorProps = {
  message?: string;
  localizedMessage: string;
};

/**
 * @deprecated
 */
export class AppError extends Error {
  // ユーザーへ表示するためのメッセージ
  localizedMessage: string;

  constructor({ message, localizedMessage }: AppErrorProps) {
    super(message);
    this.localizedMessage = localizedMessage;
    this.name = 'AppError';
  }
}

/**
 * @deprecated
 */
export class NotFoundError extends AppError {
  constructor(message?: string) {
    super({ message, localizedMessage: localizedMessages.NotFoundError });
    this.name = 'NotFoundError';
  }
}

/**
 * @deprecated
 */
export class InvalidError extends AppError {
  constructor(message?: string) {
    super({ message, localizedMessage: localizedMessages.InvalidError });
    this.name = 'InvalidError';
  }
}

/**
 * @deprecated
 */
export class InternalError extends AppError {
  constructor(message?: string) {
    super({ message, localizedMessage: localizedMessages.InternalError });
    this.name = 'InternalError';
  }
}

type GQLError = {
  message: string;
  localized_message: string;
  code: string;
  path: (string | number)[];
};

export class APIError extends Error {
  httpStatus?: number;
  isNetworkError: boolean;
  graphQLErrors: GQLError[];

  constructor(error: CombinedError) {
    super(error.message);
    this.httpStatus = typeof error.response?.status === 'number' ? error.response.status : undefined;
    if (error.networkError) {
      this.isNetworkError = true;
      this.graphQLErrors = [];
      return;
    }

    this.isNetworkError = false;
    this.graphQLErrors = error.graphQLErrors.map((err) => parseGraphQLError(err));
  }

  get canRecover(): boolean {
    if (this.isNetworkError) {
      return false;
    }
    return this.graphQLErrors.every(
      (err) => err.code === APIErrorCodes.InvalidRequest || err.code === APIErrorCodes.NotFound,
    );
  }

  get displayMessages(): string[] {
    if (this.isNetworkError) {
      return [localizedMessages.NetworkError];
    }
    return this.graphQLErrors.map((err) => err.localized_message);
  }

  get displayMessage(): string {
    return this.displayMessages[0];
  }

  get debugMessages(): string[] {
    if (this.isNetworkError) {
      return [this.message];
    }
    return this.graphQLErrors.map((err) => err.message);
  }
}

export type GraphQLErrorExtension = {
  code: string;
  localized_message: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isKnownExtension = (arg: any): arg is GraphQLErrorExtension => {
  if (arg?.code !== undefined && arg?.localized_message !== undefined) {
    return true;
  }
  return false;
};

const parseGraphQLError = (error: GraphQLError): GQLError => {
  if (!isKnownExtension(error.extensions)) {
    throw new Error('Unknown error format');
  }
  return {
    message: error.message,
    localized_message: error.extensions.localized_message,
    code: error.extensions.code,
    path: error.path ? [...error.path] : [],
  };
};

export const APIErrorCodes = {
  InvalidRequest: 'InvalidRequest',
  FailedPrecondition: 'FailedPrecondition',
  NotFound: 'NotFound',
  PermissionDenied: 'PermissionDenied',
  Unauthorized: 'Unauthorized',
  TemporaryUnavailable: 'TemporaryUnavailable',
  Canceled: 'Canceled',
  Timeout: 'Timeout',
  Internal: 'Internal',
  AlreadyExists: 'AlreadyExists',
} as const;

/**
 * @deprecated
 * @param error
 * @param isDev
 * @returns
 */
export const getDisplayMessage = (
  error: Error | null,
  isDev?: boolean,
): {
  message: string;
  details?: string[];
} => {
  const defaultMessage = localizedMessages.InternalError;
  if (!error) {
    return { message: defaultMessage };
  }
  if (error instanceof AppError) {
    return { message: error.localizedMessage, details: isDev ? [error.message] : undefined };
  }
  if (error instanceof CombinedError) {
    const apiError = new APIError(error);
    return {
      message: apiError.displayMessage,
      details: isDev ? apiError.debugMessages : undefined,
    };
  }
  if (error instanceof Error) {
    return { message: defaultMessage, details: isDev ? [error.message] : undefined };
  }
  return { message: defaultMessage };
};

export const localizedMessages = {
  NotFoundError: 'データを取得できませんでした。時間を置いてもう一度お試しください。',
  InvalidError: '入力内容に誤りがあります。',
  InternalError: '予期しないエラーが発生しました。時間を置いてもう一度お試しください。',
  NetworkError: '通信エラーが発生しました。時間を置いてもう一度お試しください。',
  APIGeneralError: '予期しないエラーが発生しました。時間を置いてもう一度お試しください。',
} as const;
