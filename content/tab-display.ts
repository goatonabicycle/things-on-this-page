interface TabData {
	url: string;
	title: string;
	time: number;
	lastActive: number;
}

export const tabDisplay = {
	tabData: [] as TabData[],

	async loadTabData(): Promise<TabData[]> {
		console.log("Requesting tab data from background");
		return new Promise((resolve) => {
			chrome.runtime.sendMessage({ type: "GET_TAB_TIMES" }, (response) => {
				console.log("Response from background:", response);
				if (response && response.tabTimes) {
					if (Array.isArray(response.tabTimes)) {
						this.tabData = response.tabTimes;
						console.log(
							`Received ${response.tabTimes.length} tabs from background`,
						);
						resolve(response.tabTimes);
					} else {
						console.warn("Tab times data is not an array:", response.tabTimes);
						resolve([]);
					}
				} else {
					console.warn("No tab times received or invalid response:", response);
					resolve([]);
				}
			});
		});
	},

	formatTime(milliseconds: number): string {
		const seconds = Math.floor(milliseconds / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);

		if (hours > 0) {
			return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
		} else if (minutes > 0) {
			return `${minutes}m ${seconds % 60}s`;
		} else {
			return `${seconds}s`;
		}
	},

	async getCurrentData(): Promise<
		{ name: string; value: string; fullWidth?: boolean }[]
	> {
		await this.loadTabData();

		if (!this.tabData || this.tabData.length === 0) {
			return [
				{
					name: "Tab tracking status",
					value:
						"No tabs tracked yet. If you've just installed the extension, try navigating between a few tabs.",
				},
			];
		}

		return [
			{
				name: "Recent tabs time",
				value: this.renderTabsTable(this.tabData),
				fullWidth: true,
			},
		];
	},

	renderTabsTable(tabs: TabData[]): string {
		if (!tabs || tabs.length === 0) return "No data available";

		let html = `
      <table class="compact-table tab-time-table">
        <thead>
          <tr>
            <th>Tab</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
    `;

		for (const tab of tabs) {
			if (!tab || !tab.url || !tab.title) continue;

			const title =
				tab.title.length > 40 ? tab.title.substring(0, 37) + "..." : tab.title;
			html += `
        <tr>
          <td title="${tab.url}">${title}</td>
          <td>${this.formatTime(tab.time || 0)}</td>
        </tr>
      `;
		}

		html += `
        </tbody>
      </table>
    `;

		return html;
	},
};
