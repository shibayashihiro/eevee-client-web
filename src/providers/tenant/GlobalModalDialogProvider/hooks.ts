/**
 * GlobalModalDialog を便利に扱うためのhooks
 */

import { useCallback } from 'react';
import { CombinedError } from 'urql';
import { captureException } from '@sentry/nextjs';

import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { useGlobalModalDialogDispatch } from '@/providers/tenant/GlobalModalDialogProvider';
import { APIError } from '@/utils/errors';

import { localizedMessages } from '../../../utils/errors';
import { useResolvedHomePath } from '../WebOrderPageStateProvider';

const alertDialogTitle = 'エラー';

type HandledError = {
  message: string;
  canRecover: boolean;
};

const handleError = (error: Error): HandledError => {
  if (error instanceof CombinedError) {
    const apiError = new APIError(error);
    return { message: apiError.displayMessage, canRecover: apiError.canRecover };
  }
  if (error instanceof APIError) {
    return { message: error.displayMessage, canRecover: error.canRecover };
  }
  // APIエラー系はurqlのonErrorでSentry送信しているため、それ以外のみここでエラー送信
  captureException(error);
  return { message: localizedMessages.InternalError, canRecover: false };
};

export const useShowAlertDialog = () => {
  const { show } = useGlobalModalDialogDispatch();

  const showAlertDialog = useCallback(
    (message: string) => {
      show(alertDialogTitle, message);
    },
    [show],
  );

  return { showAlertDialog };
};

export const useHandleErrorWithAlertDialog = () => {
  const { show } = useGlobalModalDialogDispatch();
  const router = useTenantRouter();
  const homePath = useResolvedHomePath();

  /**
   * ダイアログを表示し、復帰可能なエラーの場合はボタン押下でダイアログを閉じる
   * そうでない場合はホームへ戻る
   */
  const handleErrorWithAlertDialog = useCallback(
    (error: Error) => {
      const { message, canRecover } = handleError(error);
      if (canRecover) {
        show(alertDialogTitle, message);
        return;
      }
      const onCloseCallback = async () => {
        await router.replace(homePath);
      };
      show(alertDialogTitle, message, { onCloseCallback, closeButtonText: 'ホームへ戻る' });
    },
    [homePath, router, show],
  );

  return { handleErrorWithAlertDialog };
};

export const useShowGlobalModalDialog = () => {
  const { show } = useGlobalModalDialogDispatch();

  const showGlobalModalDialog = useCallback(
    (title: string, message: string) => {
      show(title, message, {
        // 以下の設定は、現状これしか使わないから固定してるだけなので、種類が増えそうだったら修正して良い。
        closeButtonText: 'OK',
        closeButtonVariant: 'primary',
      });
    },
    [show],
  );

  return { showGlobalModalDialog };
};
