import "./custom.css";
import { type Flags, isPanelVisible, setFlags } from "./content/feature-flags";
import { mouse } from "./content/mouse";
import { thingsPopup } from "./content/things-popup";
import { timeCounter } from "./content/time-counter";

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

chrome.runtime.onMessage.addListener(
	(message: { type: string; flags?: Flags }) => {
		if (message.type === "UPDATE_FLAGS" && message.flags) {
			setFlags(message.flags);
			thingsPopup.render();
		}
	},
);
