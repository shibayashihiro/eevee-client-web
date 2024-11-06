const endpoint = process.env.NEXT_PUBLIC_AUTH_API_ENDPOINT || 'http://0.0.0.0:8080/auth/v1';

type RequestCustomTokenByLineIdTokenRequest = {
  tenantId: string;
  liffId: string;
  lineIdToken: string;
};

// LINEのIDトークンを使って、Chompyの認証に利用可能なカスタムトークンを取得する
//
// NOTE:
//   eevee-client-webでは基本的にGraphQLを使っているが、backend側都合で、一部のAPI(認証関連)だけを
//   認証不要で用意することが難しかったため、ここだけREST APIを使っている。
export const requestCustomTokenByLineIdToken = async ({
  tenantId,
  liffId,
  lineIdToken,
}: RequestCustomTokenByLineIdTokenRequest): Promise<string> => {
  // fetchの利用箇所が増える場合は、共通化を考える
  const res = await fetch(`${endpoint}/line/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-syn-app-tenant-uid': tenantId,
      'x-syn-app-liff-id': liffId,
    },
    body: JSON.stringify({ lineIdToken }),
  });
  if (!res.ok) {
    const msg = await res.text();
    if (res.status === 400) {
      throw new Error(`Bad Request: ${msg}`);
    } else if (res.status === 401) {
      throw new Error(`Unauthorized: ${msg}`);
    } else if (res.status === 500) {
      throw new Error(`Internal Server Error: ${msg}`);
    } else {
      throw new Error(`HTTP error! status: ${res.status} message: ${msg}`);
    }
  }
  const { token } = await res.json();
  return token;
};
