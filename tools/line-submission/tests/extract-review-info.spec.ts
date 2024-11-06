import fs from 'fs';
import path from 'path';

import test, { Locator, Page } from '@playwright/test';
import { stringify } from 'csv-stringify/sync';

import { apps } from './utils/read-apps';
import { clickTab, getSection, retrieveChannelUrl, setLangToJP } from './utils/actions';

const outPath = path.join(__dirname, '..', 'out', 'review-info.csv');

type Data = {
  appName: string;
  liffId: string;
  channelId: string;

  // 以下の項目はCSV出力時に列だけ確保したいので、optionalにしておく（undefinedの場合は空文字になる）
  tenantId?: string;
  shopId?: string;
};

test.describe('審査用情報の取得', () => {
  const collectedData: Data[] = [];

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

      test('審査用情報の取得', async ({ page }) => {
        await clickTab(page, 'チャネル基本設定');
        const channelId = await getTextValueByLabel(await getLabelSection(page, '基本情報', 'チャネルID'), '審査用');

        await clickTab(page, 'LIFF');
        const liffUrl = await getTextValueByLabel(await getLabelSection(page, '基本情報', 'LIFF URL'), '審査用');
        // liffIdはURLの末尾だけ取得
        const liffId = liffUrl.split('/').pop() ?? '';

        collectedData.push({ appName: app.appName, liffId, channelId });
      });
    });
  }

  // 全て終わったらCSVに出力
  test.afterAll(async () => {
    // ベースマキナ一括取り込み用の形式で出力する
    // https://chompy.basemachina.com/projects/cbqrrfa23akg00antnsg/environments/cct97ea23akg008j9si0/actions/cp2m8pq9io6g00b7srb0/batch
    const csvContent = stringify(collectedData, {
      header: true,
      columns: [
        { key: 'tenantId', header: 'TenantID' },
        { key: 'appName', header: 'LINEミニアプリ名' },
        { key: 'liffId', header: 'LIFF ID' },
        { key: 'channelId', header: 'Channel ID' },
        { key: 'shopId', header: 'ShopID' },
      ],
    });
    fs.writeFileSync(outPath, csvContent);
  });
});

// labelを利用してより狭いsectionを取得する
async function getLabelSection(page: Page, heading: string, label: string) {
  const baseSection = await getSection(page, heading);
  return baseSection.getByText(label, { exact: true }).locator('..').locator('section');
}

async function getTextValueByLabel(parent: Locator, label: string) {
  const targetDiv = parent.getByText(label, { exact: true }).locator('..');
  return targetDiv.locator('.copyable').innerText();
}
