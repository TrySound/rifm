import { AsYouType } from "libphonenumber-js/min";

const digitsOnly = (value: string) => value.replace(/\D/g, "");

export const formatPhone = (value: string) => {
  const digits = digitsOnly(value).slice(0, 10);
  return new AsYouType("US").input(digits);
};

export const formatDate = (value: string) => {
  const digits = digitsOnly(value).slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join(" / ");
};

export const formatUppercase = (value: string) => value.replace(/[^a-z ]/gi, "").toUpperCase();
