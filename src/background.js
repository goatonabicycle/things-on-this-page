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

async function fetchFeatureFlags() {
  const url =
    "https://raw.githubusercontent.com/goatonabicycle/things-on-this-page/main/feature-flags.json";
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch feature flags:", error);
    return {};
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  const flags = await fetchFeatureFlags();
  console.log("Feature flags:", flags);
  chrome.storage.local.set({ flags });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    chrome.storage.local.get("flags", (data) => {
      chrome.tabs.sendMessage(tabId, {
        type: "UPDATE_FLAGS",
        flags: data.flags,
      });
    });
  }
});
