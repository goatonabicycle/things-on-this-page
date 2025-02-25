import Sentiment from "sentiment";

const sentiment = new Sentiment();

interface CharDistMap {
	[char: string]: number;
}

export const words = {
	getTextContent(): string {
		let pageText = "";

		try {
			const elementsToIgnore = [
				"script",
				"style",
				"iframe",
				"noscript",
				"head",
			];
			const elementsToCheck = document.querySelectorAll("body *");

			for (let i = 0; i < elementsToCheck.length; i++) {
				const element = elementsToCheck[i];

				if (
					element.id === "things-popup" ||
					element.id === "things-popup-icon" ||
					element.closest("#things-popup")
				) {
					continue;
				}

				if (elementsToIgnore.includes(element.tagName.toLowerCase())) {
					continue;
				}

				const style = window.getComputedStyle(element);
				if (
					style.display !== "none" &&
					style.visibility !== "hidden" &&
					style.opacity !== "0"
				) {
					const directText = Array.from(element.childNodes)
						.filter((node) => node.nodeType === Node.TEXT_NODE)
						.map((node) => node.textContent)
						.join(" ");

					if (directText.trim()) {
						pageText += `${directText} `;
					}
				}
			}
		} catch (e) {
			console.error("Error extracting page text:", e);
			pageText = document.body.innerText;
		}

		return pageText.trim();
	},

	getWordsOnPage(): string[] {
		const text = this.getTextContent().toLowerCase();
		const words = text.match(/[a-zA-Z]+/g) || [];
		return words;
	},

	getAverageWordLength(words: string[]): number {
		if (words.length === 0) return 0;
		const totalLength: number = words.reduce(
			(sum, word) => sum + word.length,
			0,
		);
		const averageLength: number = Math.round(totalLength / words.length);
		return averageLength;
	},

	characterDistributionMap(chars: string): CharDistMap {
		const charDistMap: CharDistMap = {};

		for (let i = 0; i < chars.length; i++) {
			const char = chars[i].toLowerCase();
			if (/[a-z0-9]/.test(char)) {
				charDistMap[char] = (charDistMap[char] || 0) + 1;
			}
		}

		return charDistMap;
	},

	getSentiment(words: string[]): Sentiment.AnalysisResult {
		const result = sentiment.analyze(words.join(" "));
		return result;
	},

	getSentimentDisplay(sentimentResult: Sentiment.AnalysisResult): string {
		const { score, positive, negative } = sentimentResult;

		let overallFeeling = "neutral";
		if (score > 0) {
			overallFeeling = "positive";
		} else if (score < 0) {
			overallFeeling = "negative";
		}

		const displayWordList = (wordList: string[]): string => {
			const uniqueSortedWordList = Array.from(new Set(wordList)).sort();
			return uniqueSortedWordList.join(", ");
		};

		const output = `  
			<div class="sentiment-container">
				<div><strong>Overall feeling:</strong> ${overallFeeling} (score: ${score})</div>
				<div class="sentiment-words"><strong>Positive words:</strong> ${positive.length > 0 ? displayWordList(positive) : "None"}</div>
				<div class="sentiment-words"><strong>Negative words:</strong> ${negative.length > 0 ? displayWordList(negative) : "None"}</div>
			</div>`;

		return output;
	},

	getLongestWord(words: string[]): string {
		if (words.length === 0) {
			return "";
		}

		let longestWord = words[0];

		for (let i = 1; i < words.length; i++) {
			if (words[i].length > longestWord.length) {
				longestWord = words[i];
			}
		}

		if (longestWord.length > 30) {
			return `${longestWord.substring(0, 30)} ...`;
		}

		return longestWord;
	},

	countWords(words: string[]): Map<string, number> {
		const counts: Map<string, number> = new Map();

		for (const word of words) {
			const count = counts.get(word) || 0;
			counts.set(word, count + 1);
		}

		return counts;
	},

	sortCountsArray(counts: Map<string, number>): Array<[string, number]> {
		const sortedCountsArray = Array.from(counts.entries()).sort((a, b) => {
			if (a[1] === b[1]) {
				return a[0].localeCompare(b[0]);
			}
			return b[1] - a[1];
		});

		return sortedCountsArray;
	},

	createTableRow(item1: string, item2: string): string {
		return `<tr><td>${item1}</td><td>${item2}</td></tr>`;
	},

	getAWordCountTable(
		words: string[],
		numberOfWords: number,
	): string | undefined {
		if (!words || words.length === 0) {
			return;
		}

		const counts = this.countWords(words);
		const sortedCountsArray = this.sortCountsArray(counts);
		const columns = 2;
		const rowsPerColumn = Math.ceil(
			Math.min(numberOfWords, sortedCountsArray.length) / columns,
		);

		let tableHTML = '<table class="compact-table word-count-table">';
		tableHTML += "<thead><tr>";

		for (let i = 0; i < columns; i++) {
			tableHTML += "<th>Word</th><th>Count</th>";
		}

		tableHTML += "</tr></thead><tbody>";

		for (let row = 0; row < rowsPerColumn; row++) {
			tableHTML += "<tr>";

			for (let col = 0; col < columns; col++) {
				const index = row + col * rowsPerColumn;

				if (index < Math.min(numberOfWords, sortedCountsArray.length)) {
					const [word, count] = sortedCountsArray[index];
					tableHTML += `<td>${word}</td><td>${count}</td>`;
				} else {
					tableHTML += "<td></td><td></td>";
				}
			}

			tableHTML += "</tr>";
		}

		tableHTML += "</tbody></table>";

		return tableHTML;
	},

	createCharDistTable(charDistMap: CharDistMap): string {
		const sortedChars = Object.entries(charDistMap)
			.sort((a, b) => b[1] - a[1])
			.filter(([char]) => /[a-zA-Z]/.test(char));

		let tableHTML = '<div class="char-dist-grid">';

		for (const [char, count] of sortedChars) {
			tableHTML += `<div class="char-item"><span class="char">${char}</span><span class="count">${count}</span></div>`;
		}

		tableHTML += "</div>";

		return tableHTML;
	},
};
