# eevee-client-web

## Getting Started

git clone してからやること

### Prerequisites

- [Node.js](https://nodejs.org/en/) (Version は package.json に記載)
- [npm](https://www.npmjs.com/)

### Installing

```sh
# git submodule で schema のリポジトリを初期化
make schema

# ※初回などdependenciesのインストールが必要な時のみ
npm install

# 実行 (デフォルトだとAPIはlocalを向きます)
npm run dev

# Staging環境として実行
npm run dev:stg
```

実行後、<http://localhost:3000/chompy-house> へのアクセスでアプリを表示します。

### Productionモードでの実行

以下のコマンドで、 productionモードで実行できます。ただし、Dynamic Routesには対応できていないため注意(Next.jsの都合)。

```sh
npm run build:stg

npm run start
```

## GraphQL

### Update Schema

上にも記載の通り、git submodule を利用して [graphql-apis](https://github.com/syninc/graphql-apis) リポジトリで schema を管理します。

更新のあった schema を取り込む例:

```sh
cd graphql-apis

# mainブランチを取り込む例です。開発中のschemaを仮で取り込みたい場合も通常のgitコマンドを駆使してコードを変更できます。
git switch main
git pull

# Project root へ戻る
cd ../

# --- 変更を反映(push)する場合 ---
# 「graphql-apisの新しいcommitを示すこと」を反映
git add graphql-apis
git push origin <branchName>
```

### Generate Code from GraphQL Schema

```sh
npm run codegen
```

以下 2 種類が生成されます。(`codegen.yml`に定義しています。)

- `src/graphql/generated/types.ts`: 全てのコードから共通で扱う Type
- `src/**/*.generated.ts`: 各 query を利用するコード。その query が不要な箇所から import されないように、`.graphql`ファイルの隣に生成されます。

## Tests

```sh
npm run test
```

## Deployment

### Staging

```sh2
npm run deploy:stg
```

### Production

1. Local の main ブランチを最新化
2. `npm version [patch|minor|major]` を実行
   - package.json 内の version が更新され、Tag と共に自動で push されます。
3. Tag が生成されたことにより GitHub Actions が動き、自動でデプロイされます。

#### [Production 環境のみ] 新規ページの追加について

「URL直アクセスを想定」した新規ページを追加した場合、 `firebase.json` の `rewrites` に追記が必要です。既存の設定を参考にしてください。

Production環境はサーバーがない（静的ホスティング）ため、動的URLに対して適切なhtmlを表示するよう、Firebaseに設定が必要となります。

> [!TIP]
> 画面遷移の場合はNext.jsのルーティングによって画面表示が可能で、firebase.jsonの設定をしなくても動きます。そのため、LINEミニアプリの場合は（必ずLIFFの1つのエンドポイントから画面遷移するため）この設定は不要です。

## URL

| env        | URL                                                  |
| ---------- | ---------------------------------------------------- |
| Staging    | <https://eevee-client-web-dev.web.app/chompy-house>  |
| Production | <https://redash.chompy.in/queries/3354> こちらを参照 |

※ Staging 環境のみ basic 認証がかかっています。ID/PASS は[こちら](https://github.com/syninc/eevee-client-web/wiki/Staging%E7%92%B0%E5%A2%83#id%E3%81%A8password%E3%81%AEsecret%E5%8C%96)

## Environment Configurations

### 環境変数

環境ごとに変更したい変数などは、 [config/{environment}.json](./config) に定義しています。

### 独自ID認証

Chompy IDとは異なる、テナント単位で独自のID認証をおこなう場合は、以下の手順をおこなう必要があります。

1. `config/{environment}.json` に `NEXT_PUBLIC_XXXX_FIREBASE_API_KEY` などの環境変数を追加
2. `src/auth/instances.ts` に、上記の環境変数を利用したgetAuthの実装を追加
3. `src/apps/data/(staging|production).ts` で、tenantIdentifierに対して、(2)で追加した認証キー(`firebaseAuthProject`)を設定

> [!NOTE]
> (1)について、わざわざ環境変数に設定しているのは、本番環境のソースコードに対して、開発環境のApiKeyなどの情報を埋め込まないようにするためです。もしソースコードに平でべた書きすると、(難読ではありつつも)本番環境のソースコードを注意深く読むと、べた書きされているコードをすべて閲覧できてしまいます。

## Sentry

Sentryにエラーを送信しています。
プロジェクトは [eevee-client-web](https://syn-inc.sentry.io/projects/eevee-client-web/?project=4507689492152320) で、環境ごとにEnvironmentを設定しています。

不要な送信を避けるため、LOCALではデフォルトではSentryを無効化しています。有効化したい場合は `NEXT_PUBLIC_SENTRY_ENABLED` を `true` に修正してください。

## Coding Guidelines

- [Coding Guideline](https://github.com/syninc/eevee-client-web/wiki/Coding-Guidelines)

## Built With

- [Next.js](https://nextjs.org/)
- [GraphQL](https://graphql.org/)
  - [urql](https://formidable.com/open-source/urql/)
  - [Code Generator](https://www.graphql-code-generator.com/)
- [Chakra UI](https://chakra-ui.com/)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
