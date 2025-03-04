import "./custom.css";
import { type Flags, isPanelVisible, setFlags } from "./content/feature-flags";
import { mouse } from "./content/mouse";
import { thingsPopup } from "./content/things-popup";
import { timeCounter } from "./content/time-counter";
import { requestTracker } from "./content/request-tracker";

mouse.monitor();

function updateEverySecond(): void {
	if (isPanelVisible("things")) {
		thingsPopup.renderThingsSection();
	}
	if (isPanelVisible("words")) {
		thingsPopup.renderWordsSection();
	}
	if (isPanelVisible("mouse")) {
		thingsPopup.renderMouseSection();
	}
	if (isPanelVisible("tabs")) {
		thingsPopup.renderTabsSection();
	}
	if (isPanelVisible("cookies")) {
		thingsPopup.renderCookiesSection();
	}
	if (isPanelVisible("requests")) {
		thingsPopup.renderRequestsSection();
	}

	timeCounter.updateTimeCounter();
	setTimeout(updateEverySecond, 1000);
}

chrome.storage.local.get("flags", (data) => {
	if (data.flags) {
		setFlags(data.flags);
	}

	thingsPopup.render();
	updateEverySecond();
});

interface ChromeMessage {
	type?: string;
	flags?: Flags;
	message?: string;
	details?: {
		url: string;
		type: string;
		method: string;
		initiator?: string;
		timeStamp?: number;
	};
}

chrome.runtime.onMessage.addListener((message: ChromeMessage) => {
	if (message.type === "UPDATE_FLAGS" && message.flags) {
		setFlags(message.flags);
		thingsPopup.render();
	}

	if (message.message === "Request" && message.details) {
		requestTracker.trackRequest(message.details);
		if (isPanelVisible("requests")) {
			thingsPopup.renderRequestsSection();
		}
	}
});
