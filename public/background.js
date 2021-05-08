//the following is now dormant since default_popup has overridden this behaviour

chrome.action.onClicked.addListener(function () {
  chrome.tabs.create({ url: "chrome://newtab" });
});
