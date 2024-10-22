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
}

export function getFlag<T extends keyof Flags>(flagName: T): Flags[T] {
	return flags[flagName];
}

export function isPanelVisible(panelName: string): boolean {
	console.log("Flags!");
	console.log(flags.panelsToShow);
	return flags.panelsToShow.includes(panelName);
}
