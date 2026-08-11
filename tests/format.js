/* @flow */
/* simple fomtatters without number overflow checks etc */

import { AsYouType } from 'libphonenumber-js';

const numberAccept = /[\d.]+/g;

const parseNumber = string => (string.match(numberAccept) || []).join('');

export const formatFixedPointNumber = (
  value: string,
  digits: number
): string => {
  const parsed = parseNumber(value);
  const [head, tail] = parsed.split('.');
  // Avoid rounding errors at toLocaleString as when user enters 1.239 and maxDigits=2 we
  // must not to convert it to 1.24, it must stay 1.23
  const scaledTail = tail != null ? tail.slice(0, digits) : '';

  let number = Number.parseFloat(`${head}.${scaledTail}`);

  // For fixed format numbers deleting "." must be no-op
  // as imagine u have 123.45 then delete "." and get 12345.00 looks bad in UI
  // so we transform here 12345 into 123.45 instead of 12345.00.
  // The main disadvantage of this, that you need carefully check input value
  // that it always has fractional part
  if (digits > 0 && tail == null) {
    const paddedHead = head.padStart(digits + 1 - head.length, '0');
    number = Number.parseFloat(
      `${paddedHead.slice(0, -digits)}.${paddedHead.slice(-digits)}`
    );
  }

  if (Number.isNaN(number)) {
    return '';
  }

  const formatted = number
    .toLocaleString('de-CH', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })
    .replace(/'/g, '’');

  return formatted;
};

export const formatFloatingPointNumber = (
  value: string,
  maxDigits: number
): string => {
  const parsed = parseNumber(value);
  const [head, tail] = parsed.split('.');
  // Avoid rounding errors at toLocaleString as when user enters 1.239 and maxDigits=2 we
  // must not to convert it to 1.24, it must stay 1.23
  const scaledTail = tail != null ? tail.slice(0, maxDigits) : '';

  const number = Number.parseFloat(`${head}.${scaledTail}`);

  if (Number.isNaN(number)) {
    return '';
  }

  const formatted = number
    .toLocaleString('de-CH', {
      minimumFractionDigits: 0,
      maximumFractionDigits: maxDigits,
    })
    .replace(/'/g, '’');

  if (parsed.includes('.')) {
    const [formattedHead] = formatted.split('.');

    // skip zero at digits position for non fixed floats
    // as at digits 2 for non fixed floats numbers like 1.50 has no sense, just 1.5 allowed
    // but 1.0 has sense as otherwise you will not be able to enter 1.05 for example
    const formattedTail =
      scaledTail !== '' && scaledTail[maxDigits - 1] === '0'
        ? scaledTail.slice(0, -1)
        : scaledTail;

    return `${formattedHead}.${formattedTail}`;
  }
  return formatted;
};

export const negNumberFormat = (str: string) => {
  const clean = str.replace(/[^\d-]+/gi, '');
  if (clean === '-') return '-';
  const r = parseInt(clean, 10);

  return r ? r.toLocaleString('en') : '';
};

export const dateFormat = (str: string) => {
  const clean = str.replace(/[^\d]+/gi, '');
  const chars = clean.split('');
  return chars.reduce(
    (r, v, index) =>
      (index === 2 || index === 4 ? `${r}-${v}` : `${r}${v}`).substr(0, 10),
    ''
  );
};

const dtSym = '__-__-____';

export const dateFormatSym = (str: string) => {
  const clean = str.replace(/[^\d]+/gi, '');
  const chars = clean.split('');
  const r = chars.reduce(
    (r, v, index) =>
      (index === 2 || index === 4 ? `${r}-${v}` : `${r}${v}`).substr(0, 10),
    ''
  );

  if (r.length === 0) return r;

  return `${r}${dtSym.substr(r.length)}`;
};

const usPhone = new AsYouType('US');

export const formatPhone = (str: string) => {
  const clean = str.replace(/[^\d]+/gi, '').substr(0, 10);
  const r = usPhone.input(clean);
  usPhone.reset();

  return r;
};
