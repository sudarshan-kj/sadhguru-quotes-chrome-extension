import {
  getFromChromeLocalStorage,
  setToChromeLocalStorage,
} from "./chromeUtils";

export const setToLocalCache = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocalCache = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

export const setToChromeCache = async (key, value) => {
  await setToChromeLocalStorage(key, value);
};

export const getFromChromeCache = async (key) => {
  let value = await getFromChromeLocalStorage(key);
  return value;
};
