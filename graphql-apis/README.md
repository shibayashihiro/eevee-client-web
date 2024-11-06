# スキーマの定義方針

基本的には [Relay GraohQL Server Specification](https://relay.dev/docs/guides/graphql-server-specification/) になんとなく従うようにしている。
クライアントが [Relay](https://relay.dev/) を使っていない場合は従わなくてもいいが、一応ページングの方法などはデファクトスタンダード的な扱いをされていたり、GitHubなども同じ方式を使っているので、特に従わない理由がないため。

以下にスキーマ定義を行う際に注意すべき点を記載している。

## Node型の定義

グローバルな識別子を持ち、直接取得するようなユースケースをもつオブジェクトは`Node`型を実装する。

```graphql
type Query {
  node(id: ID!): Node
}

type Node {
  id: ID!
}
```

`Node`を実装する型は、Queryの`Query.node`から`ID`を指定して取得できる。
逆に、グローバルに取得をさせたくないようなデータ(例えば、注文の中の1商品は注文の一部として取得されるべき)に関しては、`Node`型を実装しないようにする。
これによって、型の定義レベルでグルーバルなオブジェクトかどうかを判定可能にする。

`Node`を実装する型については、Queryに直接その型を取得するフィールドを生やさないようにする。
例えば、次のように`Node`を実装している`User`型については、`Query.user`を生やさないようにする。

```graphql
type User implements Node {
  id: ID!
}

type Query {
  user(id: ID!): User
}
```

これを生やすと全ての型について個別のフィールドを生やすことになるため、`Query.node`で代替する。
一方で、`ID`以外のパラメーターでデータを取得したい場合には個別の型のフィールドを生やしても良い。

```graphql
type Query {
  user(email: String): User
}
```

ただし、この時の注意点として、引数は全てOptionalにしておく必要がある。
将来的に`email`でなく、`name`からユーザーを取得したくなった場合に互換性を持たせるためである。

```graphql
type Query {
  # emailが空でnameだけを指定することができる。
  user(email: String, name: String): User
}
```

## ID型の内部実装

`Node`の`ID`型はグルーバルユニークな識別子となっており、`<型名>:<内部ID>`をbase64でエンコードした文字列である。
ただし、`MenuItem.ID`などは`Shop`ごとのローカルIDとなっているため、グローバルID化するために、`MenuItem:ShopID/MenuItemID`のように、親の内部IDをPrefixに含む場合がある。

いずれにせよ、クライアントが`ID`を処理する場合には、`:`で区切った1つめの要素が型名というところだけを意識すれば良い。
内部IDを解釈して分解すると将来的にAPIの変更によって壊れる可能性がある。

## コレクションの返し方

Relayのスキーマ定義ルールにしたがった場合、コレクション(配列など)を返すには以下の2つの方法がある。

1. そのまま配列(`[User]`)を返す
2. `Connection`というページングを考慮した型を返す

`Connection`は次のような型である。

```graphql
type UserConnection {
  pageInfo: PageInfo!
  nodes: [User!]!
  # edges: [UserEdge!]!
  # edgesは初期のRelayで定義されたものであるが、最近はPageInfoのcursorがが使われるようなのでedgeは不要な模様。
  # > As this spec was created with Relay Classic in mind, it’s worth noting that Relay Legacy did not define startCursor and endCursor, and relied on selecting the cursor of each edge; Relay Modern began selecting startCursor and endCursor instead to save bandwidth (since it doesn’t use any cursors in between).
  # https://relay.dev/graphql/connections.htm#sec-undefined.PageInfo.Fields
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```

次のページを取得するための`PageInfo`とそれをまとめるための`Connection`という2つの型の組み合わせからなる。

`Connection`は高機能であるため、全てを`Connection`にしてしまうのが理想的かもしれないが、その分ページネーションの実装などが必要になるためコストがかかる。
そのため、次の方針で`Connection`と配列を使い分ける。

- コレクション全体を取得しても問題にならないようなデータ量のものに関しては配列を使用する
- 一般的なユースケースで、コレクション全体を取得するようなものに関しては配列を使用する
- 一般的なユースケースで、一部のみが必要となるようなものに関しては`Connection`を使用する

基本的な方針としては配列を使えばよい。
例えばカート内の商品一覧に関しては、一度に10000商品を頼むことなどありえないので、配列にして常に全権取得しても問題がない。
逆に、`Facility`内の商品一覧などは、ページングをしないと最初の読み込みに明らかに時間がかかるため`Connection`を使用する。

## 配列のnullable

スキーマ上、配列には`!`(not null)制約をつけられる。
例えば、`[User!]!`となっていた場合は、配列はnullではない定義となるが、依然として空の配列は許可される。
空の配列とnullの扱いはほとんどの場合で同様であると思われるため、not null制約を厳密に定義して運用することは難しい。
そのため、Chompyにおいては配列に対して必ずnot null制約をつけ、クライアント側でnullを考慮しなくていいようにする。

not null制約がついている場合は、配列の要素が1以上になるという運用にすることで、モデルのドキュメントとしての役割を高めるという案もあったが、クライアント側のコードを楽にしたいという意見が多かったので見送った。