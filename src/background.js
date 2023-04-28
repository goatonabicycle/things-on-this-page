chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        message: "Request",
        details,
      });
    });
  },
  { urls: ["<all_urls>"] },
  ["requestBody"]
);
