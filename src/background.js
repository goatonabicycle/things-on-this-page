chrome.webRequest.onBeforeRequest.addListener(
	(details) => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs && tabs.length > 0) {
				chrome.tabs.sendMessage(tabs[0].id, {
					message: "Request",
					details,
				}).catch(err => console.log("Error sending request message:", err));
			}
		});
	},
	{ urls: ["<all_urls>"] },
	["requestBody"],
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
			}).catch(err => console.log("Error sending flags update:", err));
		});
	}
});

const tabTracker = {
	storageKey: 'tab_time_tracking_data',
	activeTabId: null,
	activeTabStartTime: null,
	tabData: new Map(),

	init() {
		console.log("Initializing tab tracker");

		chrome.storage.local.get([this.storageKey], (result) => {
			if (result && result[this.storageKey]) {
				try {
					const data = JSON.parse(result[this.storageKey]);
					this.tabData = new Map(data.map(tab => [tab.url, tab]));
					console.log(`Loaded ${this.tabData.size} tabs from storage`);
				} catch (error) {
					console.error('Error parsing tab data from storage:', error);
				}
			}

			chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
				if (tabs && tabs.length > 0) {
					const activeTab = tabs[0];
					this.activeTabId = activeTab.id;
					this.activeTabStartTime = Date.now();
					this.updateTabData(activeTab.url, activeTab.title || activeTab.url);
				}
			});
		});

		chrome.tabs.onActivated.addListener((activeInfo) => {
			console.log("Tab activated:", activeInfo);
			this.handleTabActivated(activeInfo);
		});
		chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
			this.handleTabUpdated(tabId, changeInfo, tab);
		});
		chrome.tabs.onRemoved.addListener((tabId) => {
			this.handleTabRemoved(tabId);
		});

		setInterval(() => {
			this.updateActiveTabTime();
			this.saveToStorage();
		}, 5000);
	},

	handleTabActivated(activeInfo) {
		this.updateActiveTabTime();
		this.activeTabId = activeInfo.tabId;
		this.activeTabStartTime = Date.now();

		chrome.tabs.get(activeInfo.tabId, (tab) => {
			if (chrome.runtime.lastError) return;
			this.updateTabData(tab.url, tab.title || tab.url);
		});
	},

	handleTabUpdated(tabId, changeInfo, tab) {
		if (tabId === this.activeTabId && (changeInfo.title || changeInfo.url)) {
			this.updateTabData(tab.url, tab.title || tab.url);
		}
	},

	handleTabRemoved(tabId) {
		if (tabId === this.activeTabId) {
			this.updateActiveTabTime();
			this.activeTabId = null;
			this.activeTabStartTime = null;
		}
	},

	updateTabData(url, title) {
		if (!url) return;

		if (!this.tabData.has(url)) {
			this.tabData.set(url, {
				url,
				title,
				time: 0,
				lastActive: Date.now()
			});
		} else {
			const tab = this.tabData.get(url);
			tab.title = title;
			tab.lastActive = Date.now();
		}
	},

	updateActiveTabTime() {
		if (!this.activeTabId || !this.activeTabStartTime) return;

		chrome.tabs.get(this.activeTabId, (tab) => {
			if (chrome.runtime.lastError) {
				this.activeTabId = null;
				this.activeTabStartTime = null;
				return;
			}

			const now = Date.now();
			const elapsed = now - this.activeTabStartTime;
			this.activeTabStartTime = now;

			const url = tab.url;
			if (!url) return;

			if (this.tabData.has(url)) {
				const tabInfo = this.tabData.get(url);
				tabInfo.time += elapsed;
				tabInfo.lastActive = now;
			} else {
				this.tabData.set(url, {
					url,
					title: tab.title || url,
					time: elapsed,
					lastActive: now
				});
			}
		});
	},

	saveToStorage() {
		const tabArray = Array.from(this.tabData.values());
		chrome.storage.local.set({
			[this.storageKey]: JSON.stringify(tabArray)
		});
	},

	getTopTabs(limit = 10) {
		this.updateActiveTabTime();

		return Array.from(this.tabData.values())
			.sort((a, b) => b.lastActive - a.lastActive)
			.slice(0, limit);
	}
};

tabTracker.init();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log("Background received message:", message);

	if (message.type === "GET_TAB_TIMES") {
		console.log("Getting tab times");

		const mockData = [{
			url: "test-url",
			title: "Test Tab",
			time: 60000,
			lastActive: Date.now()
		}];

		console.log("Sending mock data:", mockData);
		sendResponse({ tabTimes: mockData });
		return true;
	}
});