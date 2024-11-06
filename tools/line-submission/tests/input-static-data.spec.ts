import { test } from '@playwright/test';

import {
  checkByLabel,
  clickTab,
  editTextFieldByLabel,
  getSection,
  retrieveChannelUrl,
  setLangToJP,
} from './utils/actions';
import { apps } from './utils/read-apps';

for (const app of apps) {
  test.describe(`${app.appName}`, () => {
    let url = '';

    test.beforeEach(async ({ page }) => {
      if (!url) {
        url = (await retrieveChannelUrl(page, app.appName, app.channelId)) ?? '';
        if (!url) {
          throw new Error(`Failed to retrieve URL for channel ID: ${app.channelId}`);
        }
      }
      await page.goto(url);
      await page.waitForLoadState();
      await setLangToJP(page);
    });

    test.describe('事業情報の入力', () => {
      test.beforeEach(async ({ page }) => {
        await clickTab(page, '事業情報');
      });
      test('Apple Developer Programの情報', async ({ page }) => {
        const section = await getSection(page, 'Apple Developer Programの情報');
        await editTextFieldByLabel(section, '開発者名', 'Chompy, Inc.');
        await editTextFieldByLabel(section, 'チームID', '4FX9GLDX46');
      });
      test('カスタマーサポート情報', async ({ page }) => {
        const section = await getSection(page, 'カスタマーサポート情報');
        await editTextFieldByLabel(section, 'カスタマーサポートメールアドレス', 'support@chompy.jp');
      });
      test('開発担当企業情報', async ({ page }) => {
        const section = await getSection(page, '開発担当企業情報');
        await editTextFieldByLabel(section, '開発担当企業名', '株式会社Chompy');
        await checkByLabel(section, '開発担当企業タイプ', '法人');
        await editTextFieldByLabel(section, '法人番号', '8010701037828');
        await editTextFieldByLabel(section, 'ウェブサイトURL', 'https://chompy-inc.com/');
        await editTextFieldByLabel(section, 'メールアドレス', 'support@chompy-inc.com');
      });
    });

    test.describe('連絡先情報の入力', () => {
      test.beforeEach(async ({ page }) => {
        await clickTab(page, '連絡先情報');
      });

      test('連絡先情報', async ({ page }) => {
        await editTextFieldByLabel(page, '名', '開発サポート');
        await editTextFieldByLabel(page, '姓', 'Chompy');
        await editTextFieldByLabel(page, 'メールアドレス', 'dev-support@chompy-inc.com');
        await editTextFieldByLabel(page, '電話番号', '050-3205-0867');
        await editTextFieldByLabel(page, '会社名', '株式会社Chompy');
        await editTextFieldByLabel(page, '所在地', '東京都千代田区飯田橋4-6-9　STビル4F');
        await editTextFieldByLabel(page, '法人番号', '8010701037828');
      });
    });
  });
}
