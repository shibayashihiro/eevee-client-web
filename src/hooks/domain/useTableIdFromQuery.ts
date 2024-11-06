import { useRouter } from 'next/router';

/**
 * テーブルIDをクエリパラメータから取得する
 * @returns
 */
export const useTableIdFromQuery = () => {
  const router = useRouter();
  if (router.isReady && !router.query.tableId) {
    throw new Error('Invalid Request');
  }
  return typeof router.query.tableId === 'string' ? router.query.tableId : '';
};
