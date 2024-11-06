import { Link, ListItem, OrderedList, Text } from '@chakra-ui/react';
import React from 'react';

import variables from '@/styles/variables.module.scss';

export const PrivacyPolicyContentTokyu = () => {
  return (
    <>
      <Text className="bold-large">プライバシーポリシー</Text>
      <Text pt="20px" className="text-small">
        株式会社東急百貨店（以下、「当社」といいます）は、株式会社Chompyの開発・管理するアプリケーションプログラム「テイクアウト＆デリバリー
        ｂｙ
        東急フードショー」（以下、「本アプリ」といいます）を通じて提供する通信販売サービス（デリバリーサービス及びテイクアウトサービス。以下総称して「本サービス」といいます。）に関連して当社が取得する個人情報の取扱いに関する方針を次のとおり定めます
      </Text>

      <Text pt="20px" className="bold-medium">
        1. 個人情報の取得
      </Text>
      <Text className="text-small">
        当社は、本アプリを通じてお客様が商品を購入する際又は会員登録する際に入力された個人情報を、適法かつ適正な手段により取得します。
      </Text>

      <Text pt="20px" className="bold-medium">
        2. 個人情報の利用目的
      </Text>
      <Text className="text-small">当社は、お客様が登録した個人情報を、以下の目的で使用します。</Text>
      <OrderedList className="text-small" my="10px">
        <ListItem>売上処理、配達業務及びアフターサービス並びにこれに付随する業務</ListItem>
        <ListItem>当社からのメール等による案内送付</ListItem>
        <ListItem>ご意見、ご感想、アンケート等の依頼</ListItem>
        <ListItem>前各号のほか、お客様の事前の同意を得た事項</ListItem>
      </OrderedList>

      <Text pt="20px" className="bold-medium">
        3. 共同利用
      </Text>
      <Text className="text-small">
        当社は、本アプリを開発・管理する以下の事業者と、本アプリを通じてそれぞれが取得した個人情報を共同利用することがあります。なお、共同利用される個人情報については各社がプライバシーポリシーに基づき適正に管理するものとします。
      </Text>
      <Text pt="20px" className="text-small">
        （共同利用する事業者）
      </Text>
      <Text className="text-small">
        <Link color={variables.monoSecondary} href="https://chompy-inc.com/" isExternal>
          株式会社Chompy
        </Link>
        （フードデリバリーサービス
        <Link color={variables.monoSecondary} href="https://chompy.jp/" isExternal>
          Chompy
        </Link>
        運営会社）
      </Text>

      <Text pt="20px" className="text-small">
        （共同利用される個人情報の項目）
      </Text>
      <Text className="text-small">
        お客様の氏名、住所、電話番号、メールアドレス、購入された商品その他すべてのデータ
      </Text>
      <Text pt="20px" className="text-small">
        （共同利用する者の利用目的）
      </Text>
      <OrderedList className="text-small" my="10px">
        <ListItem>本サービスの提供及び本サービス上で行うお客様のサポートのため</ListItem>
        <ListItem>本サービスの運営上必要な事項を通知するため</ListItem>
        <ListItem>本サービス及び上記運営会社のサービスに関する情報を提供するため</ListItem>
        <ListItem>本サービス及び上記運営会社のサービスの改善及び新規開発に必要となる解析及び分析のため</ListItem>
        <ListItem>お客様や行政機関からの問合せへの対応のため</ListItem>
        <ListItem>個人を特定しない範囲での統計情報の作成及び利用のため</ListItem>
        <ListItem>代金の請求、返金、支払等及び関連する事務処理のため</ListItem>
      </OrderedList>

      <Text pt="20px" className="bold-medium">
        4.個人情報の開示・修正
      </Text>
      <Text className="text-small">
        当社は、お客様の登録情報の徹底した管理をするとともに、以下の場合を除いては第三者への開示は行いません。
      </Text>
      <OrderedList className="text-small" my="10px">
        <ListItem>お客様の事前の同意・承認を得た場合</ListItem>
        <ListItem>
          本アプリにおける本サービスの利用や商品の注文等で決済が必要な場合に、金融機関との間で個人情報の確認が必要な場合
        </ListItem>
        <ListItem>
          お客様からの問合せや、お買上商品のアフターサービス等で機密保持に関する契約を締結している会社等から直接連絡することが適切と判断した場合
        </ListItem>
        <ListItem>正当な利用の範囲内で業務委託先に委託する場合</ListItem>
        <ListItem>その他法令等により、開示・提供が必要な場合</ListItem>
      </OrderedList>

      <Text pt="20px" className="bold-medium">
        5.免責事項等
      </Text>
      <Text className="text-small">
        万一、本アプリのセキュリティ施策にもかかわらず、ハッカー等による不当な行為により、お客様及び第三者に損害が生じる場合、当社は、その責任を負いかねます。
      </Text>

      <Text pt="20px" className="bold-medium">
        6.変更・改定
      </Text>
      <Text className="text-small">
        当社は、本プライバシーポリシーの内容を適宜見直し、必要に応じて変更することがあります。その場合、改定版の公表日から変更後のプライバシーポリシーが適用されることになります。
      </Text>

      <Text pt="20px" className="bold-medium">
        7.当社情報
      </Text>
      <Text className="bold-small">販売会社</Text>
      <Text className="text-small">株式会社 東急百貨店</Text>
      <Text className="bold-small">所在地</Text>
      <Text className="text-small">〒150-8019 東京都渋谷区道玄坂二丁目24番1号</Text>
      <Text className="bold-small">代表者</Text>
      <Text className="text-small">取締役社長執行役員 大石 次則</Text>
      <Text className="text-small" mt="20px">
        ２０２２年６月１３日 改定
      </Text>
      <Text className="text-small">２０２１年８月１日 制定</Text>
    </>
  );
};
