// Imageがないときに、サーバーは白紙の画像を返してくる。
// それを考慮して、画像がない場合はundefinedを返す。
export function safeImage(image: string | null | undefined): string | undefined {
  if (!image) {
    return undefined;
  }
  return image.includes('img_placeholder_') ? undefined : image;
}
