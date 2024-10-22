export const timeCounter: {
	timeSinceInitialLoad: number;
	updateCounterDisplay: () => void;
	updateTimeCounter: () => void;
} = {
	timeSinceInitialLoad: -1,

	updateCounterDisplay() {
		const timeSinceLoadElement = document.getElementById("time-since-load");
		if (timeSinceLoadElement) {
			timeSinceLoadElement.textContent = this.timeSinceInitialLoad.toString();
		}
	},

	updateTimeCounter() {
		this.timeSinceInitialLoad++;
		this.updateCounterDisplay();
	},
};
