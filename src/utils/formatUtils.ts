const yenFormatter = new Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'JPY',
  signDisplay: 'auto',
});

export function formatPrice(value: string | number): string {
  if (typeof value === 'string') {
    const parsedValue = Number(value);
    if (isNaN(parsedValue)) {
      throw new Error('formatPrice: value is not a number');
    }
    return yenFormatter.format(parsedValue);
  } else {
    return yenFormatter.format(value);
  }
}

export const replaceToUpperAlphaNumerics = (value: string): string => {
  return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
};

export const replaceToNumerics = (value: string): string => {
  return value.replace(/[^0-9]/g, '');
};

export const toJpPhoneNumber = (value: string): string => {
  const prefix = '+81';
  if (value.startsWith(prefix)) {
    return value;
  }
  return '+81' + value.substring(1);
};

export const fromJpPhoneNumber = (value: string): string => {
  const prefix = '+81';
  if (value.startsWith(prefix)) {
    return '0' + value.substring(prefix.length);
  }
  return value;
};

export const toFullAddress = (prefecture: string, addressLine: string, buildingName: string, roomNumber: string) => {
  return `${prefecture} ${addressLine} ${buildingName} ${roomNumber}`;
};

export const meterToKmText = (value: number, digits = 1): string => {
  return `${(value / 1000).toFixed(digits)}km`;
};

// 分のみ0埋めありの時・分にフォーマットする(例: 1:00)
export const formatDateToHMM = (value: Date): string => {
  const hours = value.getHours();
  const minutes = value.getMinutes();
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
};

export const formatDateToYMD = (value: Date): string => {
  const year = value.getFullYear();
  const month = value.getMonth() + 1;
  const day = value.getDate();
  return `${year}/${month}/${day}`;
};

export const formatDateToYMDjp = (value: Date): string => {
  const year = value.getFullYear();
  const month = value.getMonth() + 1;
  const day = value.getDate();
  return `${year}年${month}月${day}日`;
};

// ex) 2024-12-31T23:59:59.999Z -> 12/31
export const formatDateToMDslash = (value: Date): string => {
  const month = value.getMonth() + 1;
  const day = value.getDate();
  return `${month}/${day}`;
};

// ex) => 2021/10/18 12:14
export const formatDateToYMDHM = (value: Date): string => {
  const year = value.getFullYear();
  const month = value.getMonth() + 1;
  const day = value.getDate();
  const hours = value.getHours();
  const minutes = value.getMinutes();
  return `${year}/${month}/${day} ${hours}:${minutes.toString().padStart(2, '0')}`;
};
