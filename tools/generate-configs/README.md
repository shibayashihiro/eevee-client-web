# eevee-webのconfig生成ツール

## SQL

```sql
/*
 * このクエリで表示されないLINEミニアプリは、設定が漏れている。
 * (configurationができていない、shopに紐付けできていない、etc...)
 */
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
    "" as url_path,
    configuration.liff_id
from
    `chompy-jp.firestore_latest.Shop` as shp
    join tenant_shops as tn on shp.document_id = tn.shop_id
    join `chompy-jp.firestore_latest.Tenant_TenantLINEMiniAppConfiguration` as cfg on shp.shop.line_mini_app_configuration_id = cfg.document_id
```

[Redash](https://redash.chompy.in/queries/3888)
