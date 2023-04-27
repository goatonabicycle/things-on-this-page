// Define a callback function to handle the network requests
function logRequest(details) {
  console.log(details);
}

// Add the listener to the webRequest API
chrome.webRequest.onBeforeRequest.addListener(
  logRequest,
  { urls: ["<all_urls>"] },
  ["requestBody"]
);
