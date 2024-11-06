import { doc, getFirestore } from 'firebase/firestore';

import { firebaseApp } from '.';

export const TenantCartDocRef = (cartId: string, tenantId: string) => {
  return doc(getFirestore(firebaseApp), 'Tenant', tenantId, 'TenantCart', cartId, 'Ping', cartId);
};
