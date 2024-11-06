import { useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';

import { useTenantUid } from '@/providers/tenant/WebOrderPageStateProvider';
import { TenantCartDocRef } from '@/utils/firebase/firebase_doc_ref';

type Props = {
  // カートのID(※GraphQL用のglobalidではない生のID)
  cartRawId: string;
  onChangeCart: () => void | Promise<void>;
};

// イートインでは、テーブルごとにカートを共有するため、カート変更を検知してデータを再取得したい。
// そのためのカート監視用Component。
export const CartWatcher = ({ cartRawId, onChangeCart }: Props) => {
  const tenantUid = useTenantUid();
  useEffect(() => {
    // onSnapshotはlistenしてすぐにも1回呼ばれる。
    // GraphQL & Fragment を利用している都合で、初回は全体のクエリでデータを取得済で
    // その後の変更を検知して再度データを取得するユースケースが多いので、初回の呼び出しは無視する。
    // （ユースケースが変わりそうだったら修正する）
    let isFirstSnapshot = true;
    const doc = TenantCartDocRef(cartRawId, tenantUid);
    const unSubscribe = onSnapshot(doc, (_) => {
      if (isFirstSnapshot) {
        isFirstSnapshot = false;
        return;
      }
      onChangeCart();
    });
    return () => {
      unSubscribe();
    };
  }, [cartRawId, onChangeCart, tenantUid]);
  return null;
};
