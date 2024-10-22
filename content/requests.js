chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message === "Request") {
		requestTracking.requestCount++;

		if (request.details.type in requestTracking.requestsByType) {
			requestTracking.requestsByType[request.details.type]++;
		} else {
			requestTracking.requestsByType[request.details.type] = 1;
		}

		import("./things-popup.js").then((module) => {
			module.thingsPopup.renderRequestsSection();
		});

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
			{
				name: "Requests by Type",
				value: this.formatRequestData(this.requestsByType),
			},
		];
		return requestData;
	},

	formatRequestData(requestData) {
		let formattedData = "";
		for (const [name, value] of Object.entries(requestData)) {
			formattedData += `<div>${name}: ${value}</div>`;
		}
		return formattedData;
	},
};
