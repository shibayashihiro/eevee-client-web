/*
ItemCodeForm = "番号検索"
ItemList = "商品一覧検索"
という二つの商品検索方法を扱っており、それぞれの検索方法をそのボタンがタップされるたびにlocalStorageに保存している。
繊維の分岐があるときに、`isItemSearchMethodItemCodeForm`を使って、どちらの検索方法が選択されているかを判定している。
*/
const key = 'item-search-method';
const itemCodeFormVal = 'itemCodeForm';
const itemListVal = 'itemList';

export const setItemCodeForSearchMethod = () => {
  localStorage.setItem(key, itemCodeFormVal);
};

export const setItemListForSearchMethod = () => {
  localStorage.setItem(key, itemListVal);
};

const getItemSearchMethod = () => {
  return localStorage.getItem(key);
};

export const isItemSearchMethodItemCodeForm = () => {
  return getItemSearchMethod() === itemCodeFormVal;
};
