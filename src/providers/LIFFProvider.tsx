import { useEffect, useState } from 'react';
import liff from '@line/liff';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

type Props = {
  children: React.ReactNode;
  liffId: string | null;
};

/**
 * LIFFの初期化を行うProvider. (ProviderといいつつContextは持たない。)
 * このComponentの配下であれば、liffを安全に利用できる。
 *
 * 例:
 *
 *  ```
 *  import liff from '@line/liff';
 *  const idToken = liff.getIDToken();
 *  ```
 *
 * 実装は create-liff-app の生成内容を参考にしている。
 * https://developers.line.biz/ja/docs/liff/cli-tool-create-liff-app/
 */
export const LIFFProvider = ({ children, liffId }: Props) => {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!liff.isInClient()) {
      setLoading(false);
      return;
    }

    const initLiff = async () => {
      if (ignore) {
        return;
      }
      if (!liffId) {
        setError(new Error('[Internal] LIFF IDを取得できませんでした'));
        return;
      }
      try {
        setLoading(true);
        await liff.init({ liffId });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    let ignore = false;
    initLiff();
    return () => {
      ignore = true;
    };
  }, [liffId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <>LIFFアプリの初期化に失敗しました。恐れ入りますが、一度画面を閉じてから再度お試しください。</>;
  }

  return <>{children}</>;
};
