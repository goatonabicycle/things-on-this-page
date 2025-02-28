export interface Flags {
	outlineColour: string;
	panelsToShow: string[];
}

let flags: Flags = {
	outlineColour: "blue",
	panelsToShow: [],
};

export function setFlags(newFlags: Flags): void {
	flags = newFlags;
	if (
		typeof thingsPopup !== "undefined" &&
		thingsPopup.updateCategoryVisibility
	) {
		thingsPopup.updateCategoryVisibility();
	}
}

export function getFlag<T extends keyof Flags>(flagName: T): Flags[T] {
	return flags[flagName];
}

export function isPanelVisible(panelName: string): boolean {
	return flags.panelsToShow.includes(panelName);
}
