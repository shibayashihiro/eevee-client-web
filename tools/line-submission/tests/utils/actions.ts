import { Locator, Page, expect } from '@playwright/test';

// 本番用のchannelIdをもとに、ページにアクセスしてURLを取得する。
// URLは基本連番なので、決められた回数まで -1 してアクセスできるまで試す。
export async function retrieveChannelUrl(page: Page, appName: string, prodChannelId: string) {
  const baseUrl = 'https://developers.line.biz/console/channel';
  const maxAttempts = 5;

  for (let i = 0; i < maxAttempts; i++) {
    const channelIdPath = (Number(prodChannelId) - 1 * (i + 2)) /* -2から開始 */
      .toString();
    const url = `${baseUrl}/${channelIdPath}`;
    await page.goto(url);
    try {
      await expect(page.getByRole('heading', { name: appName })).toBeVisible();
      return url;
    } catch {
      continue;
    }
  }
  return null;
}

export async function clickTab(page: Page, tabName: string) {
  await page.getByRole('navigation').getByRole('button', { name: tabName }).click();
}

export async function getSection(page: Page, heading: string) {
  return page.getByRole('heading', { name: heading }).locator('..');
}

export async function setLangToJP(page: Page) {
  await page.locator('dl.lang-change').hover();
  await page.waitForSelector('dl.lang-change ul.lang-menu');
  await page.locator('dl.lang-change ul.lang-menu a:has-text("JP")').click();
}

export async function editTextFieldByLabel(parent: Page | Locator, label: string, value: string) {
  const targetDiv = parent.getByText(label, { exact: true }).locator('..');
  await targetDiv.getByRole('button', { name: '編集' }).click();
  await targetDiv.getByRole('textbox').fill(value);
  await targetDiv.getByRole('button', { name: '更新' }).click();

  // 更新後の確認。本当はやったほうが良いと思うが、更新ボタンを押したあと固まってしまうことがあるためコメントアウト。
  // await targetDiv.locator('span').getByText(value).waitFor();
}

export async function checkByLabel(parent: Page | Locator, label: string, radioName: string) {
  const targetDiv = parent.getByText(label, { exact: true }).locator('..');
  await targetDiv
    .getByRole('button', { name: '編集' })
    .first() // radioボタン入力は、見出しラベルがなくて特定しきれない（2つ以上ヒットしてしまう)ことがあるため、最初の要素を選択する
    .click();
  await targetDiv.getByLabel(radioName).check({
    force: true, // 他の要素にinterceptされている場合に強制的にチェックする
  });
  await targetDiv.getByRole('button', { name: '更新' }).click();

  // 更新後の確認。本当はやったほうが良いと思うが、更新ボタンを押したあと固まってしまうことがあるためコメントアウト。
  // await targetDiv.locator('span').getByText(radioName).waitFor();
}
