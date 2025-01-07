# LINE申請の入力作業自動化ツール

[LINEミニアプリの申請作業](https://www.notion.so/chompy/LINE-ecf1384c12ff4c82a3a8a405544a9153?pvs=4)の、画面上での入力作業をある程度自動化します。
一旦完全固定の入力値を自動入力するところまで。

## 使い方

1. 認証についてセットアップしておく。（後述）
2. CSV(入力用データ)を準備しておく。 (後述)
3. 以下のコマンドを実行するとUIが開くので、実行したいシナリオを実行する。

```bash
npm run open
```

### 認証について

LINE Developersにはログイン情報が必要。
自身のブラウザでログインした状態でCookieをexportするなどして、`tools/line-submission/playwright/.auth/user.json` を作成する必要がある。

.auth/user.json

```json
{
  "cookies": [
    // (ここにcookiesを貼り付ける。)
    // 大文字小文字の表記揺れでエラーになるので注意
    // 例えば `"sameSite": "lax"` => `"sameSite": "Lax"` に修正する必要あり
  ]
}
```

以前は本ツール内でログインも自動でおこなっていたが、LINE側に対策されてしまったため今は使えない。

### CSVデータの取得方法

以下のように、 app_name, channel_id のリストを取得する。

```sql
with tenant_shops as (
    select
        shop_id
    from
        `chompy-jp.firestore_latest.Tenant` as tn
        cross join unnest(tenant.shop_ids) as shop_id
        join `chompy-jp.firestore_latest.Shop` as shp on shp.document_id = shop_id
    where
        tn.document_id = '{{ tenant_id }}'
)
select
    configuration.app_name,
    configuration.channel_id
from
    `chompy-jp.firestore_latest.Shop` as shp
    join tenant_shops as tn on shp.document_id = tn.shop_id
    join `chompy-jp.firestore_latest.Tenant_TenantLINEMiniAppConfiguration` as cfg on shp.shop.line_mini_app_configuration_id = cfg.document_id
```

[Redash Link](https://redash.chompy.in/queries/3887/source?p_tenant_id=fQeZITIAeY7rfGTPYjGX) (消えてたらすみません)
