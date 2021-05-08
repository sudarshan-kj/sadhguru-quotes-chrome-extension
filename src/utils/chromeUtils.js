/*global chrome*/

async function getLocalVersion() {
  return new Promise((resolve) => {
    resolve({ version: "1.6_L" });
  });
}

export const getVersion = (function () {
  let data;
  return async () => {
    if (!data) {
      if (chrome.management) data = await chrome.management.getSelf();
      else data = await getLocalVersion();
    }
    return data;
  };
})();

export const setToChromeLocalStorage = (key, value) => {
  value = JSON.stringify(value);
  new Promise((resolve) => {
    if (chrome.storage) {
      chrome.storage.sync.set({ key: value }, function () {
        resolve();
      });
    } else {
      localStorage.setItem(key, value);
      resolve();
    }
  });
};

export const getFromChromeLocalStorage = (key) => {
  return new Promise((resolve) => {
    if (chrome.storage) {
      chrome.storage.sync.get([key], function (result) {
        resolve(result);
      });
    } else {
      let value = JSON.parse(localStorage.getItem(key));
      resolve(value);
    }
  });
};
