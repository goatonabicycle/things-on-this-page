import { words } from "./words";

interface ThingOnPage {
	name: string;
	value: string;
	display?: "table";
	fullWidth?: boolean;
}

export const page = {
	getThingsOnThisPage(): ThingOnPage[] {
		const result: ThingOnPage[] = [];

		result.push({ name: "Images", value: document.images.length.toString() });
		result.push({ name: "Scripts", value: document.scripts.length.toString() });
		result.push({
			name: "Style Sheets",
			value: document.styleSheets.length.toString(),
		});
		result.push({ name: "Links", value: document.links.length.toString() });
		result.push({
			name: "Page height",
			value: `${Math.max(
				document.body.scrollHeight,
				document.body.offsetHeight,
				document.documentElement.clientHeight,
				document.documentElement.scrollHeight,
				document.documentElement.offsetHeight,
			)}px`,
		});
		result.push({
			name: "Page width",
			value: `${
				window.innerWidth ||
				document.documentElement.clientWidth ||
				document.body.clientWidth
			}px`,
		});
		result.push({
			name: "Fonts on this page",
			value: this.getFonts().join(", "),
			display: "table",
			fullWidth: true,
		});
		result.push({
			name: "Seconds since initial load",
			value: "<span id='time-since-load'></span>",
		});

		const timing = window.performance.timing;
		const loadTime = (timing.loadEventEnd - timing.navigationStart) / 1000;
		result.push({
			name: "Page load time",
			value: `${loadTime}s`,
		});

		return result;
	},

	getWordThings(): ThingOnPage[] {
		const result: ThingOnPage[] = [];
		const wordsOnThisPage = words.getWordsOnPage();
		const textContent = words.getTextContent();

		result.push({
			name: "Total number of characters",
			value: textContent.length.toString(),
		});

		result.push({
			name: "Number of words on page",
			value: wordsOnThisPage.length.toString(),
		});

		result.push({
			name: "Top 20 words on this page",
			value:
				words.getAWordCountTable(wordsOnThisPage, 20) || "No data available",
			display: "table",
			fullWidth: true,
		});

		result.push({
			name: "Average word length",
			value: words.getAverageWordLength(wordsOnThisPage).toString(),
		});

		result.push({
			name: "Longest word",
			value: words.getLongestWord(wordsOnThisPage),
		});

		result.push({
			name: "Character distribution map",
			value: words.createCharDistTable(
				words.characterDistributionMap(textContent),
			),
			display: "table",
			fullWidth: true,
		});

		const sentiment = words.getSentiment(wordsOnThisPage);
		result.push({
			name: "Sentiments",
			value: words.getSentimentDisplay(sentiment),
			fullWidth: true,
		});

		return result;
	},

	getFonts(): string[] {
		const fonts = new Set<string>();
		const elements = document.querySelectorAll(
			"body *:not(#things-popup):not(#things-popup-icon):not(#things-popup *)",
		);

		for (let i = 0; i < elements.length; i++) {
			const computedStyle = window.getComputedStyle(elements[i]);
			const font = computedStyle.getPropertyValue("font-family");
			const fontList = font.split(",");

			for (const f of fontList) {
				fonts.add(`<span style='font-family:${f.trim()}'>${f.trim()}</span>`);
			}
		}

		return Array.from(fonts);
	},
};
