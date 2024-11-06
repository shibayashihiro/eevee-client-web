import { ParsedUrlQuery } from 'querystring';

export const validatePhoneNumber = (phoneNumberString: string): boolean => {
  const phoneNumber = phoneNumberString.replace(/-/g, '');
  const phoneNumberIsValid = phoneNumber.length === 11;
  return phoneNumberIsValid;
};

export const validateKana = (v: string): boolean => {
  const kanaRegex = new RegExp('^[ァ-ヴー]+$');
  return kanaRegex.test(v);
};

export const validateEmail = (v: string): boolean => {
  const emailRegex = new RegExp('^[a-zA-Z0-9.!#$%&"*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$');
  return emailRegex.test(v);
};

type ExpectedQuery = {
  tenantIdentifier: string;
  facilityId?: string;
};

export const validateQueryTenantIdentifier = (query: ParsedUrlQuery): query is ExpectedQuery => {
  const { tenantIdentifier, facilityId } = query;
  if (typeof tenantIdentifier !== 'string') {
    return false;
  }
  if (!(facilityId === undefined || typeof facilityId === 'string')) {
    return false;
  }
  return true;
};
