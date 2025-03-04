interface RequestsByType {
	[type: string]: number;
}

interface RequestData {
	url: string;
	type: string;
	initiator?: string;
	timestamp: number;
}

interface RequestDetails {
	url: string;
	type: string;
	method: string;
	initiator?: string;
	timeStamp?: number;
}

interface ItemData {
	name: string;
	value: string;
	display?: "table";
	fullWidth?: boolean;
}

export const requestTracker = {
	requestCount: 0,
	requestsByType: {} as RequestsByType,
	requestLog: [] as RequestData[],

	trackRequest(details: RequestDetails): void {
		this.requestCount++;

		if (details.type in this.requestsByType) {
			this.requestsByType[details.type]++;
		} else {
			this.requestsByType[details.type] = 1;
		}

		try {
			const initiator = details.initiator || "unknown";

			this.requestLog.push({
				url: details.url,
				type: details.type,
				initiator,
				timestamp: Date.now(),
			});

			if (this.requestLog.length > 1000) {
				this.requestLog = this.requestLog.slice(-1000);
			}
		} catch (error) {
			console.error("Error processing request:", error);
		}
	},

	getCurrentData(): ItemData[] {
		const result: ItemData[] = [
			{ name: "Total requests", value: this.requestCount.toString() },
		];

		if (Object.keys(this.requestsByType).length > 0) {
			let tableHTML =
				'<table class="compact-table"><thead><tr><th>Request Type</th><th>Count</th></tr></thead><tbody>';

			for (const [type, count] of Object.entries(this.requestsByType).sort(
				(a, b) => b[1] - a[1],
			)) {
				tableHTML += `<tr><td>${type}</td><td>${count}</td></tr>`;
			}

			tableHTML += "</tbody></table>";

			result.push({
				name: "Requests by Type",
				value: tableHTML,
				fullWidth: true,
			});
		}

		if (this.requestLog.length > 0) {
			let requestsTableHTML =
				'<table class="compact-table"><thead><tr><th>Type</th><th>URL</th><th>Time</th></tr></thead><tbody>';

			const recentRequests = [...this.requestLog]
				.sort((a, b) => b.timestamp - a.timestamp)
				.slice(0, 20);

			for (const request of recentRequests) {
				let displayUrl = request.url;
				try {
					const urlObj = new URL(request.url);
					displayUrl = `${urlObj.hostname}${urlObj.pathname}`;
					if (displayUrl.length > 40) {
						displayUrl = `${displayUrl.substring(0, 37)}...`;
					}
				} catch (e) {
					if (displayUrl.length > 40) {
						displayUrl = `${displayUrl.substring(0, 37)}...`;
					}
				}

				const time = new Date(request.timestamp).toLocaleTimeString();

				requestsTableHTML += `<tr>
          <td>${request.type}</td>
          <td title="${request.url}">${displayUrl}</td>
          <td>${time}</td>
        </tr>`;
			}

			requestsTableHTML += "</tbody></table>";

			result.push({
				name: "Recent Requests",
				value: requestsTableHTML,
				fullWidth: true,
			});
		}

		return result;
	},

	reset(): void {
		this.requestCount = 0;
		this.requestsByType = {};
		this.requestLog = [];
	},
};
