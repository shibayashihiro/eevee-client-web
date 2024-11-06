import fs from 'fs';
import path from 'path';

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

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'service-provider.json'), 'utf-8'));

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

    test.describe('サービス事業主の入力', () => {
      test.beforeEach(async ({ page }) => {
        await clickTab(page, '事業情報');
      });
      test('サービス事業主', async ({ page }) => {
        const section = await getSection(page, 'サービス事業主');
        await editTextFieldByLabel(section, 'サービス事業主名', data.providerName);
        await checkByLabel(section, 'サービス事業主タイプ', '法人');
        await editTextFieldByLabel(section, '法人番号', data.corporateNumber);
        await editTextFieldByLabel(section, 'ウェブサイトURL', data.websiteUrl);
        await editTextFieldByLabel(section, 'メールアドレス', data.email);
      });
    });
  });
}
