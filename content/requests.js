import { thingsPopup } from "./things-popup";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "Request") {
    requestTracking.requestCount++;

    if (request.details.type in requestTracking.requestsByType) {
      requestTracking.requestsByType[request.details.type]++;
    } else {
      requestTracking.requestsByType[request.details.type] = 1;
    }

    thingsPopup.renderRequestsSection();
    // Available types
    // "main_frame"
    // "sub_frame"
    // "stylesheet"
    // "script"
    // "image"
    // "font"
    // "object"
    // "xmlhttprequest"
    // "ping"
    // "csp_report"
    // "media"
    // "websocket"
    // "webbundle"
    // "other"
  }
});

export const requestTracking = {
  requestCount: 0,
  requestsByType: {},

  getCurrentData() {
    const requestData = [
      { name: "Total requests", value: this.requestCount },
      { name: "Requests by Type", value: this.requestsByType },
    ];
    return requestData;
  },
};
